import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
    if (!locals.user) {
                                                        // future proofing: if added search params
        const returnTo = encodeURIComponent(url.pathname + (url.search || ""));
        throw redirect(303, `/login?returnTo=${returnTo}`);
    }

    return { user: locals.user }
}
