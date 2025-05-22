import { writable } from 'svelte/store';

import { io } from 'socket.io-client';

const PROD_URL = import.meta.env.PROD_URL || "http://localhost:9000";

const createSocketStore = () => {

  const socket = io(PROD_URL, {withCredentials: true});
  const { subscribe, set } = writable(socket);

  return {
    subscribe,
    on: (event, callback) => {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    },

    emit: (event, data) => socket.emit(event, data),

    disconnect: () => {
      socket.disconnect();
      set(null);
    }
  };
}

export const socket = createSocketStore();
