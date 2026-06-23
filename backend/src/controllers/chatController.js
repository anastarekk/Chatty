const chatService = require("../services/chatService");

const createConversation = async (req, res) => {
    try {
        const { userId } = req.body; // other user

        const currentUserId = req.user.id; // from JWT middleware

        const conversation = await chatService.createConversation(
            currentUserId,
            userId
        );

        res.status(201).json(conversation);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await chatService.getUserConversations(userId);

        res.status(200).json(conversations);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

module.exports = {
    createConversation,
    getConversations
};
