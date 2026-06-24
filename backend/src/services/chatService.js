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
        `SELECT 
            c.*,
            u1.username AS user1_username,
            u2.username AS user2_username
         FROM conversations c
         JOIN users u1 ON c.user1_id = u1.id
         JOIN users u2 ON c.user2_id = u2.id
         WHERE c.user1_id = $1 OR c.user2_id = $1
         ORDER BY c.created_at DESC`,
        [userId]
    );

    return result.rows;
};

module.exports = {
    createConversation,
    getUserConversations
};