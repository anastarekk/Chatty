const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const register = async (username, email, password) => {
    const userExists = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (userExists.rows.length > 0) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
        `INSERT INTO users (username, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, username, email, created_at`,
        [username, email, hashedPassword]
    );

    return result.rows[0];
};

const login = async (email, password) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        },
        token
    };
};

module.exports = { register, login };