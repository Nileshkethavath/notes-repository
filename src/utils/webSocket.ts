import { io } from 'socket.io-client'

export const webSocket = io(import.meta.env.VITE_WEBSOCKET_MAIN);
export const authNameSpace = io(import.meta.env.VITE_WEBSOCKET_AUTH);