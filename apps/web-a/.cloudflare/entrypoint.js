import openNextWorker from '../.open-next/worker.js';

const rewrites = [
  {
    source: '/articles',
    destination: '/blog',
  },
  {
    source: '/news',
    destination: '/blog',
  },
];

const redirects = [
  {
    source: '/happy',
    destination: '/blog',
  },
];

const generateCustomRequest = (request) => {
  const url = new URL(request.url);

  const rewrite = rewrites.find(({ source }) =>
    url.pathname.startsWith(source)
  );
  if (rewrite) {
    url.pathname = url.pathname.replace(rewrite.source, rewrite.destination);

    return new Request(url.toString(), request);
  }

  return request;
};

const generateRedirectResponse = (request) => {
  const url = new URL(request.url);

  const redirect = redirects.find(({ source }) =>
    url.pathname.startsWith(source)
  );

  if (!redirect) return undefined;
  
  const destinationUrl = new URL(redirect.destination, url.origin);

  return Response.redirect(destinationUrl.toString(), 302);
};

// eslint-disable-next-line
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

    return redirectResponse ?? openNextWorker.fetch(customRequest, env, ctx);
  },
};
