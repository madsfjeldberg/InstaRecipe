import { redirect } from '@sveltejs/kit';

import authApi from '$lib/api/authApi.js';
import userApi from '$lib/api/userApi.js';



const verifyJWT = async (token) => {
  try {
    // verifies against the source of truth (redis)
    // will throw an error if the token is invalid or expired
    return await authApi.verifyToken(token);
    
  } catch (error) {
    throw error
  }
}

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('refreshToken');
  if (token) {
    try {
      const payload = await verifyJWT(token);
      event.locals.user = payload;

    } catch (error) {
      event.cookies.delete('refreshToken', { path: '/' });

      event.locals.user = null;
      throw redirect(303, '/login?returnTo=' + encodeURIComponent(event.url.pathname)); 
      //                                             ^^
      // im logged in on 2 devices, I logout of one, the other one should redirect to login when attempting to access a protected route. 
      // Next time I login, redirect me back to original requested page
    }

  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
