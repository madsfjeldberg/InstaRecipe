import { isActive } from '../stores/sessionStore.js';

let refreshInterval;

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '/auth';

export function startTokenRefresh() {
  console.log('[TokenRefresh] Starting token refresh loop');

  if (refreshInterval) return; // already running

  refreshInterval = setInterval(async () => {
    let active;
    isActive.subscribe(value => active = value)();

    console.log(`[TokenRefresh] User active? ${active}`);

    if (active) {
      try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          console.error('Failed to refresh token');
        } else {
          console.log('Token refreshed successfully');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  }, 10 * 1000); // every 10 seconds
}
