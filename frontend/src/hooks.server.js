import { redirect } from '@sveltejs/kit';

import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '$lib/config/env.server.js'; 

import userApi from '$lib/api/userApi.js';



const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.id, username: decoded.username, email: decoded.email };

  } catch (error) {
    throw error
  }
}

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('jwt');
  if (token) {
    try {
      const payload = verifyJWT(token);
      const user = await userApi.getUserById(payload.id);
      event.locals.user = user;

    } catch (error) {
      console.error('JWT verification failed:', error);
      event.locals.user = null;
      throw redirect(303, '/login');
    }

  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
