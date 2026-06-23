const pool = require("../config/db");

const sendMessage = async (conversationId, senderId, content) => {

    // 1. Check conversation exists
    const conversation = await pool.query(
        "SELECT * FROM conversations WHERE id = $1",
        [conversationId]
    );

    if (conversation.rows.length === 0) {
        throw new Error("Conversation not found");
    }

    const conv = conversation.rows[0];

    // 2. Check sender is part of conversation
    const isParticipant =
        conv.user1_id === senderId || conv.user2_id === senderId;

    if (!isParticipant) {
        throw new Error("You are not part of this conversation");
    }

    // 3. Insert message
    const result = await pool.query(
        `INSERT INTO messages (conversation_id, sender_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [conversationId, senderId, content]
    );

    return result.rows[0];
};

const getMessages = async (conversationId, userId) => {

    // 1. Check conversation exists
    const conversation = await pool.query(
        "SELECT * FROM conversations WHERE id = $1",
        [conversationId]
    );

    if (conversation.rows.length === 0) {
        throw new Error("Conversation not found");
    }

    const conv = conversation.rows[0];

    // 2. Check access
    const isParticipant =
        conv.user1_id === userId || conv.user2_id === userId;

    if (!isParticipant) {
        throw new Error("Access denied");
    }

    // 3. Get messages
    const result = await pool.query(
        `SELECT * FROM messages
         WHERE conversation_id = $1
         ORDER BY created_at ASC`,
        [conversationId]
    );

    return result.rows;
};

module.exports = {
    sendMessage,
    getMessages
};