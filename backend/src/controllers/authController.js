const authService = require("../services/authService");

// REGISTER
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await authService.register(username, email, password);

        return res.status(201).json(user);

    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await authService.login(email, password);

        return res.status(200).json(result);

    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

module.exports = {
    register,
    login
};