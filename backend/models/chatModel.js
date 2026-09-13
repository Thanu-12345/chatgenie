const db = require("../config/db");

const createConversation = (userId, title, callback) => {
    const sql = `
        INSERT INTO conversations
        (user_id, title)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, title], callback);
};

const getConversations = (userId, callback) => {
    const sql = `
        SELECT *
        FROM conversations
        WHERE user_id = ?
        ORDER BY updated_at DESC
    `;

    db.query(sql, [userId], callback);
};

const getConversation = (conversationId, userId, callback) => {
    const sql = `
        SELECT *
        FROM conversations
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(sql, [conversationId, userId], callback);
};

const getMessages = (conversationId, callback) => {
    const sql = `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
    `;

    db.query(sql, [conversationId], callback);
};

const createMessage = (conversationId, role, message, callback) => {
    const sql = `
        INSERT INTO messages
        (conversation_id, role, message)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [conversationId, role, message],
        callback
    );
};

const deleteConversation = (conversationId, userId, callback) => {
    const sql = `
        DELETE FROM conversations
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [conversationId, userId],
        callback
    );
};

const updateConversationTitle = (conversationId, title, callback) => {
    const sql = `
        UPDATE conversations
        SET title = ?
        WHERE id = ?
    `;

    db.query(sql, [title, conversationId], callback);
};



module.exports = {
    createConversation,
    getConversations,
    getConversation,
    getMessages,
    createMessage,
    deleteConversation,
    updateConversationTitle
};