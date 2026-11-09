import { redirectLocation, redirectStatus } from './routing.js';

export default {
  fetch(request, env) {
    const location = redirectLocation(new URL(request.url));
    if (location) return Response.redirect(location, redirectStatus);
    return env.ASSETS.fetch(request);
  },
};
