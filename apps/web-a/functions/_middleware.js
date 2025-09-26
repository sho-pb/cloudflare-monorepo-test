async function errorHandling(context) {
  try {
    return await context.next();
  } catch (error) {
    return new Response(`${error.message}\n${error.stack}`, { status: 500 });
  }
}

async function handleRequest({ next, request }) {
  const BASIC_USER = 'admin';
  const BASIC_PASS = 'password';

  if (request.headers.has('Authorization')) {
    const authorization = request.headers.get('Authorization');

    const [scheme, encoded] = authorization.split(' ');

    if (!encoded || scheme.toLowerCase() !== 'basic') {
      return new Response('Unauthorized', { status: 401 });
    }

    const buffer = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(buffer).normalize();

    const index = decoded.indexOf(':');

    // eslint-disable-next-line no-control-regex
    if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const user = decoded.substring(0, index);
    const pass = decoded.substring(index + 1);

    if (BASIC_USER !== user || BASIC_PASS !== pass) {
      return new Response('Unauthorized', { status: 401 });
    }

    return await next();
  }

  return new Response('You need to authenticate', {
    status: 401,
    headers: {
      // Prompts the user for credentials.
      'WWW-Authenticate': 'Basic realm="my scope", charset="UTF-8"',
    },
  });
}

export const onRequest = [errorHandling, handleRequest];
