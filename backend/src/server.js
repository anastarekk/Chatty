require("dotenv").config();

const http = require("http");
const app = require("./app");
const pool = require("./config/db");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Attach socket
initSocket(server);

async function startServer() {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("PostgreSQL connected:", result.rows[0]);

        server.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("DB connection failed", err);
        process.exit(1);
    }
}

startServer();