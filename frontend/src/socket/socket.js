import { io } from "socket.io-client";

const socket = io("https://chatty-production-aa56.up.railway.app", {
    autoConnect: false,
});

export default socket;