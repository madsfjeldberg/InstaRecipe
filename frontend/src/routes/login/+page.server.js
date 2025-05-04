export function load({ locals }) {
  // locals.user is set in hooks.server.js
  // This will be available in the +layout.svelte file
  console.log('Loading user data in login:', locals.user);
  return {
    user: locals.user || null,
  };
}