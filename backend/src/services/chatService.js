const pool = require("../config/db");

const createConversation = async (user1Id, user2Id) => {

    // enforce consistent ordering 
    const [userA, userB] =
        user1Id < user2Id
            ? [user1Id, user2Id]
            : [user2Id, user1Id];

    // check if conversation already exists
    const existing = await pool.query(
        `SELECT * FROM conversations
         WHERE user1_id = $1 AND user2_id = $2`,
        [userA, userB]
    );

    if (existing.rows.length > 0) {
        return existing.rows[0];
    }

    // create new conversation
    const result = await pool.query(
        `INSERT INTO conversations (user1_id, user2_id)
         VALUES ($1, $2)
         RETURNING *`,
        [userA, userB]
    );

    return result.rows[0];
};

const getUserConversations = async (userId) => {

    const result = await pool.query(
        `SELECT * FROM conversations
         WHERE user1_id = $1 OR user2_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

module.exports = {
    createConversation,
    getUserConversations
};