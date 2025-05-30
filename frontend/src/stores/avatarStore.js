import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const createAvatarStore = () => {
  const initial = browser
    ? localStorage.getItem('user-avatar') || ''
    : '';
  const store = writable(initial);

  if (browser) {
    store.subscribe((val) => {
      localStorage.setItem('user-avatar', val);
    });
  }

  return store;
}

export const avatarStore = createAvatarStore();
