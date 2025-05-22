import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
  if (locals.user) {
    // user is already authenticated → short-circuit to /explore
    throw redirect(303, '/explore');
  }
  
  const returnTo = url.searchParams.get('returnTo') || '/explore';
  return { url: url.pathname, returnTo };
}