# ChatGenie – AI Chatbot Web Application

ChatGenie is a full-stack AI chatbot web application that allows users to register, log in, create conversations, and interact with an AI assistant powered by Google Gemini.

## Live Demo

Frontend:
https://chatgenie-mauve.vercel.app/

Backend:
https://chatgenie-backend-ofzx.onrender.com/

## Features

### User Features
- User Registration
- Secure Login and Logout
- JWT Authentication
- Protected Chat Access
- AI-powered conversations
- Conversation history
- Multiple conversations
- Automatic conversation titles
- Delete conversations
- Clear chat interface
- Markdown-formatted AI responses
- Suggested prompts
- Responsive chat interface

### AI Features
- Google Gemini API integration
- Context-aware conversations
- AI-generated responses
- Markdown support for formatted answers

## Technologies Used

### Frontend
- React.js
- Vite
- React Router
- React Markdown
- CSS

### Backend
- Node.js
- Express.js
- REST API
- JWT
- bcryptjs
- CORS

### Database
- MySQL
- Aiven Cloud

### AI
- Google Gemini API

### Deployment
- Vercel
- Render
- Aiven

## Project Structure

chatgenie/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    └── vite.config.js

## How It Works

1. User registers or logs into ChatGenie.
2. JWT authentication is used to protect the chat APIs.
3. Users can create multiple conversations.
4. User messages are stored in MySQL.
5. Conversation history is sent to Google Gemini.
6. Gemini generates the AI response.
7. The response is stored and displayed in the chat interface.
8. Users can access their previous conversations whenever they log in.

## Database

The application uses MySQL with the following tables:

- users
- conversations
- messages

## Deployment Architecture

React Frontend
        ↓
      Vercel
        ↓
Express REST API
        ↓
     Render
        ↓
     MySQL
        ↓
      Aiven

AI requests are processed using the Google Gemini API.

## Future Enhancements

- Dark mode
- Voice input
- File/image upload
- AI response regeneration
- Conversation rename option
- Streaming AI responses
- Chat sharing
- Admin dashboard

## Author

Thanmayee

GitHub:
https://github.com/Thanu-12345