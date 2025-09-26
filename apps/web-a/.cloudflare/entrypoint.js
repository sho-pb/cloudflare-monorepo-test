import openNextWorker from "../.open-next/worker.js";

// eslint-disable-next-line
export default {
  async fetch(request, env, ctx) {
    const auth = request.headers.get("Authorization");
    const valid = "Basic " + btoa(`admin:password`);

    if (auth !== valid) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Restricted"',
        },
      });
    }

    // 認証OKなら OpenNext の worker に渡す
    return openNextWorker.fetch(request, env, ctx);
  },
};
