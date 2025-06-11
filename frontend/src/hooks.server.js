import { redirect } from '@sveltejs/kit';

import authApi from '$lib/api/authApi.js';
import userApi from '$lib/api/userApi.js';



const verifyJWT = async (token) => {
  try {
    const decoded = await authApi.verifyToken(token);
    return { id: decoded.id, username: decoded.username, email: decoded.email };

  } catch (error) {
    throw error
  }
}

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('refreshToken');
  if (token) {
    try {
      const payload = await verifyJWT(token);
      const user = await userApi.getUserById(payload.id);
      const { avatar, avatarMime, ...modifiedUser } = user;
      event.locals.user = modifiedUser;

    } catch (error) {
      event.cookies.delete('refreshToken', { path: '/' });

      event.locals.user = null;
      throw redirect(303, '/login');
    }

  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
