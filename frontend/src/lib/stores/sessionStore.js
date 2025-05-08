import { writable } from 'svelte/store';

// Writable store to track if user is active
export const isActive = writable(false);

// Helper to detect activity
let activityTimeout;
const ACTIVITY_TIME = 5 * 60 * 1000; // 5 minutes of inactivity

function setActive() {
  isActive.set(true);
  clearTimeout(activityTimeout);
  
  activityTimeout = setTimeout(() => {
    isActive.set(false);
  }, ACTIVITY_TIME);
}

// Attach activity listeners
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', setActive);
  window.addEventListener('keydown', setActive);
  window.addEventListener('click', setActive);
}