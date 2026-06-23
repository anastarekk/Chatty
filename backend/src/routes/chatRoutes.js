const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/conversation",
    authMiddleware,
    chatController.createConversation
);

router.get(
    "/conversations",
    authMiddleware,
    chatController.getConversations
);

module.exports = router;
