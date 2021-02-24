module.exports = `/* Import your Controllers and/or Middleware here */
const Authorization = include("app.http.middleware.Authorization");
const Cache = include("app.core.cache");

module.exports = (Route) => [
  /* Route here */
  // Route.router.get('/my/path', /* Middleware fn() */),
]`;
