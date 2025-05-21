import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
  if (locals.user) {
    // user is already authenticated → short-circuit to /dashboard
    throw redirect(303, '/dashboard');
  }
}