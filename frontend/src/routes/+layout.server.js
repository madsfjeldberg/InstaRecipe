import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$lib/config/env.server';
import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
  return { user: locals.user, url: url.pathname };
}
