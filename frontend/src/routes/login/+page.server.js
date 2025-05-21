import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
  if (locals.user) {
    // user is already authenticated → short-circuit to /dashboard
    throw redirect(303, '/dashboard');
  }
  
  const returnTo = url.searchParams.get('returnTo') || '/dashboard';
  return { url: url.pathname, returnTo };
}