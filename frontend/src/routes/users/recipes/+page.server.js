import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
    if (!locals.user) {
                        //ensures correct encoding of URI such as spaces
        const returnTo = encodeURIComponent(url.pathname);
        throw redirect(303, `/auth/login?returnTo=${returnTo}`);
    }

    return { user: locals.user }
}
