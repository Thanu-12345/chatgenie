import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API_URL from "../services/api";

function Chat() {
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const response = await fetch(
                `${API_URL}/chat/conversations`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to load conversations.");
                return;
            }

            setConversations(data);

            if (data.length > 0) {
                loadMessages(data[0].id);
            }
        } catch (error) {
            setError("Unable to connect to server.");
        }
    };

    const loadMessages = async (conversationId) => {
        setLoadingMessages(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/chat/conversations/${conversationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to load messages.");
                return;
            }

            setCurrentConversation(conversationId);
            setMessages(data);
        } catch (error) {
            setError("Unable to load conversation.");
        } finally {
            setLoadingMessages(false);
        }
    };

    const createConversation = async () => {
    setError("");

    try {
        const response = await fetch(
            `${API_URL}/chat/conversations`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(
                data.message ||
                "Failed to create conversation."
            );
            return;
        }

        const newConversation = {
            id: data.id,
            title: data.title
        };

        setConversations((previous) => [
            newConversation,
            ...previous
        ]);

        // Immediately open the new conversation
        setCurrentConversation(data.id);

        // Start with an empty chat
        setMessages([]);

        // Clear any previous error
        setError("");

    } catch (error) {
        setError("Unable to create conversation.");
    }
};

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim() || loading) {
            return;
        }

        let conversationId = currentConversation;

        setError("");

        try {
            if (!conversationId) {
                const response = await fetch(
                    `${API_URL}/chat/conversations`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Failed to create conversation."
                    );
                    return;
                }

                conversationId = data.id;

                setConversations((previous) => [
                    {
                        id: data.id,
                        title: data.title
                    },
                    ...previous
                ]);

                setCurrentConversation(conversationId);
            }

            const userMessage = input.trim();

            setMessages((previous) => [
                ...previous,
                {
                    role: "user",
                    message: userMessage
                }
            ]);

            setInput("");
            setLoading(true);

            const response = await fetch(
                `${API_URL}/chat/message`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        conversationId,
                        message: userMessage
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Failed to get AI response."
                );
                return;
            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    message: data.message
                }
            ]);

            loadConversations();

        } catch (error) {
            setError("Unable to connect to AI service.");
        } finally {
            setLoading(false);
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            const response = await fetch(
                `${API_URL}/chat/conversations/${conversationId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Failed to delete conversation."
                );
                return;
            }

            const remaining = conversations.filter(
                (conversation) =>
                    conversation.id !== conversationId
            );

            setConversations(remaining);

            if (currentConversation === conversationId) {
                if (remaining.length > 0) {
                    loadMessages(remaining[0].id);
                } else {
                    setCurrentConversation(null);
                    setMessages([]);
                }
            }
        } catch (error) {
            setError("Unable to delete conversation.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
    });
}, [messages, loading]);

    return (
        <div className="chat-page">

            {/* Sidebar */}

            <aside className="chat-sidebar">

                <div className="sidebar-header">
                    <h2>🤖 ChatGenie</h2>

                    <button
                        className="new-chat-btn"
                        onClick={createConversation}
                    >
                        + New Chat
                    </button>
                </div>

                <div className="conversation-list">

                    {conversations.length === 0 ? (
                        <p className="empty-conversations">
                            No conversations yet.
                        </p>
                    ) : (
                        conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`conversation-item ${
                                    currentConversation === conversation.id
                                        ? "active"
                                        : ""
                                }`}
                            >

                                <button
                                    className="conversation-button"
                                    onClick={() =>
                                        loadMessages(conversation.id)
                                    }
                                >
                                    💬{" "}
                                    {conversation.title ||
                                        "New Conversation"}
                                </button>

                                <button
                                    className="delete-chat-btn"
                                    onClick={() =>
                                        deleteConversation(
                                            conversation.id
                                        )
                                    }
                                >
                                    🗑️
                                </button>

                            </div>
                        ))
                    )}

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </aside>

            {/* Main Chat */}

            <main className="chat-main">

                <div className="chat-header">

    <div>
        <h2>AI Assistant</h2>
        <span>Powered by Gemini</span>
    </div>

    {currentConversation && messages.length > 0 && (
        <button
            className="clear-chat-btn"
            onClick={() => setMessages([])}
        >
            🧹 Clear Chat
        </button>
    )}

</div>

                <div className="messages-area">
                
                    {loadingMessages ? (
                        <div className="chat-status">
                            Loading conversation...
                        </div>    
                    ) : messages.length === 0 ? (
                        <div className="welcome-message">

    <div className="big-bot">
        🤖
    </div>

    <h1>
        How can I help you?
    </h1>

    <p>
        Ask me anything and let's start a conversation.
    </p>

    <div className="suggested-prompts">

        <button
            onClick={() =>
                setInput("Explain machine learning")
            }
        >
            💡 Explain machine learning
        </button>

        <button
            onClick={() =>
                setInput("Write a Java program")
            }
        >
            💻 Write a Java program
        </button>

        <button
            onClick={() =>
                setInput("Explain React.js")
            }
        >
            🌐 Explain React.js
        </button>

        <button
            onClick={() =>
                setInput("What is data science?")
            }
        >
            📊 What is data science?
        </button>

    </div>

</div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message-row ${
                                    message.role === "user"
                                        ? "user-row"
                                        : "assistant-row"
                                }`}
                            >

                                <div className="message-avatar">
                                    {message.role === "user"
                                        ? "👤"
                                        : "🤖"}
                                </div>

                                <div className="message-bubble">
    {message.role === "assistant" ? (
        <ReactMarkdown>
            {message.message}
        </ReactMarkdown>
    ) : (
        message.message
    )}
</div>

                            </div>
                            
                        ))
                        
                    )}

                    {loading && (
    <div className="message-row assistant-row">

        <div className="message-avatar">
            🤖
        </div>

        <div className="message-bubble typing">
            <span className="thinking-text">
                AI is thinking
            </span>

            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
        </div>

    </div>
)}<div ref={messagesEndRef} />

                </div>

                {error && (
                    <div className="chat-error">
                        {error}
                    </div>
                )}

                <form
                    className="message-input-area"
                    onSubmit={sendMessage}
                >

                    <input
                        type="text"
                        placeholder="Message ChatGenie..."
                        value={input}
                        onChange={(e) => {
    setInput(e.target.value);
    setError("");
}}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            !input.trim()
                        }
                    >
                        ➤
                    </button>

                </form>

            </main>

        </div>
    );
}

export default Chat;