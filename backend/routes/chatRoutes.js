const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    createNewConversation,
    getMyConversations,
    getChatMessages,
    sendMessage,
    removeConversation
} = require("../controllers/chatController");

router.post(
    "/conversations",
    authMiddleware,
    createNewConversation
);

router.get(
    "/conversations",
    authMiddleware,
    getMyConversations
);

router.get(
    "/conversations/:id",
    authMiddleware,
    getChatMessages
);

router.post(
    "/message",
    authMiddleware,
    sendMessage
);

router.delete(
    "/conversations/:id",
    authMiddleware,
    removeConversation
);

module.exports = router;