import { writable } from 'svelte/store';

// This store manages the authentication state of the user on the client side
// It uses Svelte's writable store to create a reactive variable
// isAuthenticated: boolean - true if the user is logged in, false otherwise
// user: object - contains user information if logged in, null otherwise

export const isAuthenticated = writable(false);
export const user = writable(null);

export const updateAuthState = (userData) => {
  // Convert userData to boolean, true if userData is not null or undefined
  // can alse be written as: isAuthenticated.set(userData ? true : false);
  isAuthenticated.set(!!userData); 
  user.set(userData);
}