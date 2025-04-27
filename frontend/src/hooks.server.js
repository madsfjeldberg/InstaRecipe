import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from '$lib/stores/authStore';
import { JWT_SECRET, COOKIE_OPTIONS } from '$lib/config/env.server';

// This is a SvelteKit hook that runs on every request
// It checks if the user is authenticated by looking for a JWT token in cookies
// If the token is not present and the user is trying to access a protected route,
// it redirects them to the login page
// If the token is present, it verifies the token and decodes it to get user info
// The user info is then saved in event.locals for later use

// The data can be accessed in the load function of any route

const validateUser = (token) => {
  if (!token) {
    throw redirect(303, '/login');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.id, username: decoded.username };
  } catch (err) {
    console.error('JWT verification failed:', err);
    throw redirect(303, '/login');
  }
}

export const handle = async ({ event, resolve }) => {

  const protectedPaths = ['/dashboard', '/settings'];
  const isProtectedPath = protectedPaths.some(path => event.url.pathname.startsWith(path));

    // Check if user is trying to access protected route
  if (isProtectedPath) {
    const token = event.cookies.get('jwt');
    const user = validateUser(token);
    // If token is valid, save user info in event.locals for later use
    event.locals.user = user;
  }
  const response = await resolve(event);
  return response;
}

    