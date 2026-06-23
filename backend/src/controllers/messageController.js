const messageService = require("../services/messageService");

const sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        const senderId = req.user.id;

        if (!conversationId || !content) {
            return res.status(400).json({
                message: "conversationId and content are required"
            });
        }

        const message = await messageService.sendMessage(
            conversationId,
            senderId,
            content
        );

        res.status(201).json(message);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        const messages = await messageService.getMessages(
            conversationId,
            userId
        );

        res.status(200).json(messages);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

module.exports = {
    sendMessage,
    getMessages
};