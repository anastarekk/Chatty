const { Server } = require("socket.io");
const messageService = require("../services/messageService");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Join conversation room
        socket.on("join_conversation", (conversationId) => {
            socket.join(conversationId);
            console.log(`Joined room: ${conversationId}`);
        });

        // Send message
        socket.on("send_message", async (data) => {
            try {
                const { conversationId, senderId, content } = data;

                // Save message using existing service
                const message = await messageService.sendMessage(
                    conversationId,
                    senderId,
                    content
                );

                // Emit to everyone in conversation room
                io.to(conversationId).emit("receive_message", message);

            } catch (err) {
                console.error("Socket message error:", err.message);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = {
    initSocket
};