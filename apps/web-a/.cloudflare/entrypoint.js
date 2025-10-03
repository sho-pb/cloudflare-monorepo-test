import openNextWorker from '../.open-next/worker.js';

const generateCustomRequest = (request) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/articles')) {
    url.pathname = url.pathname.replace('/articles', '/blog');

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
