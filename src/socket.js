import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(socketUrl, {
  autoConnect: false
});
