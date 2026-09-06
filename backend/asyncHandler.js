/**
 * asyncHandler.js
 * -----------------------------------------------------------------------
 * Express 4 does NOT automatically catch rejected promises thrown inside
 * `async (req, res) => {...}` route handlers — an unhandled rejection
 * there just hangs the request forever instead of reaching our error
 * middleware in server.js. Wrapping every async route with this closes
 * that gap: any thrown error (a bad query, a lost DB connection, a
 * business-rule Error) is forwarded to `next(err)` and turned into a
 * clean JSON 500/400 response instead of silently hanging or crashing
 * the process.
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
