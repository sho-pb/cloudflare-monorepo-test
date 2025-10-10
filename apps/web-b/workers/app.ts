import { createRequestHandler } from 'react-router';

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
);

const rewrites = [
  {
    source: '/articles',
    destination: '/',
  },
  {
    source: '/news',
    destination: '/',
  },
];

const redirects = [
  {
    source: '/happy',
    destination: '/',
  },
];

const generateCustomRequest = (request: Request) => {
  const url = new URL(request.url);

  const rewrite = rewrites.find(({ source }) =>
    url.pathname.startsWith(source)
  );
  if (rewrite) {
    url.pathname = url.pathname.replace(rewrite.source, rewrite.destination);

    return new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: request.redirect,
    });
  }

  return request;
};

const generateRedirectResponse = (request: Request) => {
  const url = new URL(request.url);

  const redirect = redirects.find(({ source }) =>
    url.pathname.startsWith(source)
  );

  if (!redirect) return undefined;

  const destinationUrl = new URL(redirect.destination, url.origin);

  return Response.redirect(destinationUrl.toString(), 302);
};

export default {
  async fetch(request, env, ctx) {
    const auth = request.headers.get('Authorization');
    const valid = 'Basic ' + btoa(`admin:password`);

    if (auth !== valid) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Restricted"',
        },
      });
    }

    const customRequest = generateCustomRequest(request);
    const redirectResponse = generateRedirectResponse(request);

    return (
      redirectResponse ??
      requestHandler(customRequest, {
        cloudflare: { env, ctx },
      })
    );
  },
} satisfies ExportedHandler<Env>;
