/**
 * An Array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
];

/**
 * An Array of routes that are protected
 * These routes require authentication
 * @type {string[]}
 */
export const protectedRoutes: string[] = [
  "/dashboard",
  "/playground",
];

/**
 * Routes used for authentication.
 * If the user is already logged in, visiting these redirects to DEFAULT_LOGIN_REDIRECT.
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth/sign-in",
];

/**
 * Prefix for NextAuth API authentication routes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * Default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
