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

// eslint-disable-next-line
export default {
  async fetch(request, env, ctx) {
    const auth = request.headers.get('Authorization');
    const valid = 'Basic ' + btoa(`admin:password`);

    const customRequest = generateCustomRequest(request);

    if (auth !== valid) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Restricted"',
        },
      });
    }

    // 認証OKなら OpenNext の worker に渡す
    return openNextWorker.fetch(customRequest, env, ctx);
  },
};
