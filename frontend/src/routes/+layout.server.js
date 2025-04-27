import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$lib/config/env.server';

export function load({ cookies }) {
  const token = cookies.get('jwt');
  let user = null;

  if (token) {
    try {
      // verify will throw if invalid / expired
      const payload = jwt.verify(token, JWT_SECRET);
      user = { id: payload.id, username: payload.username };
    } catch {
      // invalid or expired token
      cookies.delete('jwt');
    }
  }
  return { user }; // user === null if not logged in
}