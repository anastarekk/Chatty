const chatService = require("../services/chatService");
const pool = require("../config/db");

const createConversation = async (req, res) => {
    try {
        const { email } = req.body;
        const currentUserId = req.user.id;

        // look up user by email
        const userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const otherUserId = userResult.rows[0].id;

        if (otherUserId === currentUserId) {
            return res.status(400).json({ message: "Cannot chat with yourself" });
        }

        const conversation = await chatService.createConversation(
            currentUserId,
            otherUserId
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
