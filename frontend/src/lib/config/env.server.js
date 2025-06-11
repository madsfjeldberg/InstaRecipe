import { env } from '$env/dynamic/private';

// This file is used to load environment variables from the .env file
// and make them available in the application.
// currently only used in hooks.server.js

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  path: '/',
  maxAge: 3600,
};