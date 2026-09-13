import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home">

            <section className="hero">

                <div className="hero-content">

                    <div className="hero-icon">
                        🤖
                    </div>

                    <h1>
                        Welcome to <span>ChatGenie</span>
                    </h1>

                    <p>
                        Your intelligent AI chatbot for conversations,
                        ideas, learning, and everyday questions.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/register" className="primary-btn">
                            Get Started
                        </Link>

                        <Link to="/login" className="secondary-btn">
                            Login
                        </Link>
                    </div>

                </div>

            </section>

            <section className="features">

                <h2>What ChatGenie Can Do</h2>

                <div className="feature-grid">

                    <div className="feature-card">
                        <div className="feature-icon">💬</div>
                        <h3>AI Conversations</h3>
                        <p>
                            Have natural conversations with an
                            intelligent AI assistant.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3>Conversation Memory</h3>
                        <p>
                            ChatGenie keeps your conversation context
                            for a better chat experience.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📚</div>
                        <h3>Learn & Explore</h3>
                        <p>
                            Ask questions, learn concepts, generate
                            ideas, and explore different topics.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;