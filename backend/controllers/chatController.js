const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const {
    createConversation,
    getConversations,
    getConversation,
    getMessages,
    createMessage,
    deleteConversation,
    updateConversationTitle
} = require("../models/chatModel");



const createNewConversation = (req, res) => {
    const userId = req.user.id;

    createConversation(
        userId,
        "New Conversation",
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to create conversation."
                });
            }

            res.status(201).json({
                id: result.insertId,
                title: "New Conversation"
            });
        }
    );
};

const getMyConversations = (req, res) => {
    getConversations(req.user.id, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch conversations."
            });
        }

        res.json(results);
    });
};

const getChatMessages = (req, res) => {
    const userId = req.user.id;
    const conversationId = req.params.id;

    getConversation(
        conversationId,
        userId,
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Conversation not found."
                });
            }

            getMessages(
                conversationId,
                (err, messages) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Failed to fetch messages."
                        });
                    }

                    res.json(messages);
                }
            );
        }
    );
};

const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId, message } = req.body;

        if (!conversationId || !message?.trim()) {
            return res.status(400).json({
                message: "Conversation and message are required."
            });
        }

        getConversation(
            conversationId,
            userId,
            async (err, conversations) => {
                if (err) {
                    return res.status(500).json({
                        message: "Database error."
                    });
                }

                if (conversations.length === 0) {
                    return res.status(404).json({
                        message: "Conversation not found."
                    });
                }

                createMessage(
                    conversationId,
                    "user",
                    message.trim(),
                    async (err) => {
                        if (err) {
                            return res.status(500).json({
                                message: "Failed to save message."
                            });
                        }
                        updateConversationTitle(
    conversationId,
    message.trim().slice(0, 40),
    () => {}
);

                        getMessages(
                            conversationId,
                            async (err, history) => {
                                if (err) {
                                    return res.status(500).json({
                                        message:
                                            "Failed to load chat history."
                                    });
                                }

                                try {
                                    const contents = history.map(
                                        (item) => ({
                                            role:
                                                item.role ===
                                                "assistant"
                                                    ? "model"
                                                    : "user",
                                            parts: [
                                                {
                                                    text: item.message
                                                }
                                            ]
                                        })
                                    );

                                    const response =
    await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents
    });
                                    const aiMessage =
                                        response.text;

                                    createMessage(
                                        conversationId,
                                        "assistant",
                                        aiMessage,
                                        (err) => {
                                            if (err) {
                                                return res.status(500).json({
                                                    message:
                                                        "Failed to save AI response."
                                                });
                                            }

                                            res.json({
                                                message: aiMessage
                                            });
                                        }
                                    );

                                } catch (error) {
                                    console.error(
                                        "Gemini API Error:",
                                        error
                                    );

                                    res.status(500).json({
                                        message:
                                            "AI service failed. Please try again."
                                    });
                                }
                            }
                        );
                    }
                );
            }
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

const removeConversation = (req, res) => {
    deleteConversation(
        req.params.id,
        req.user.id,
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to delete conversation."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Conversation not found."
                });
            }

            res.json({
                message:
                    "Conversation deleted successfully."
            });
        }
    );
};

module.exports = {
    createNewConversation,
    getMyConversations,
    getChatMessages,
    sendMessage,
    removeConversation
};