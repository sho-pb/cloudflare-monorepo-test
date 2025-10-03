import openNextWorker from '../.open-next/worker.js';

// eslint-disable-next-line
export default {
  async fetch(request, env, ctx) {
    const auth = request.headers.get('Authorization');
    const valid = 'Basic ' + btoa(`admin:password`);

    let _request = request;

    const url = new URL(request.url);
    if (url.pathname.startsWith('/articles')) {
      url.pathname = url.pathname.replace('/articles', '/blog');
      _request = new Request(url.toString(), request);
    }

    if (auth !== valid) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Restricted"',
        },
      });
    }

    // 認証OKなら OpenNext の worker に渡す
    return openNextWorker.fetch(_request, env, ctx);
  },
};
