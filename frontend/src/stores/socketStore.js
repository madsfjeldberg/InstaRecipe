import { writable } from 'svelte/store';
import { io } from 'socket.io-client';

const prodUrl = import.meta.env.PROD_URL || "http://localhost:9000";

function createSocketStore() {
  
  const socket = io(prodUrl, {withCredentials: true});
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
