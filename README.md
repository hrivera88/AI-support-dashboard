# AI-Powered Customer Support Dashboard

A modern customer support dashboard with AI-powered response generation, sentiment analysis, and knowledge base search.

## Project Structure

```
ai-support-dashboard/
├── client/                    # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── chat/        # Chat interface components
│   │   │   ├── dashboard/   # Analytics components
│   │   │   ├── ai/          # AI feature components
│   │   │   └── common/      # Shared components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── stores/          # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   └── public/
├── server/                   # Express backend (TypeScript)
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Helper functions
│   └── data/                # Sample data/embeddings
└── shared/                   # Shared types/constants
```

## Features

- 🤖 **Smart Response Generator**: AI-powered contextual response generation
- 📊 **Real-time Sentiment Analysis**: Analyze customer emotions and urgency
- 🔍 **AI-Powered Knowledge Search**: Semantic search across documentation
- ⭐ **Response Quality Scoring**: AI evaluation of agent responses
- 📈 **Analytics Dashboard**: Performance metrics and insights

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS + Radix UI
- TanStack Query for data fetching
- Zustand for state management
- TensorFlow.js for client-side AI
- Recharts for analytics

### Backend
- Node.js + Express + TypeScript
- OpenAI API integration
- Pinecone for vector storage
- Redis for caching
- Comprehensive security middleware

## Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API Key
- Optional: Pinecone API Key, Redis instance

### Installation

1. **Clone and setup**
   ```bash
   cd ai-support-dashboard
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Environment setup**
   ```bash
   # Client environment
   cd ../client
   cp .env.example .env
   # Edit .env with your API keys

   # Server environment
   cd ../server
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/health

## Environment Variables

### Client (.env)
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENABLE_SENTIMENT_ANALYSIS=true
VITE_ENABLE_KNOWLEDGE_SEARCH=true
VITE_ENABLE_RESPONSE_SCORING=true
```

### Server (.env)
```
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
```

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

- `GET /health` - Health check
- `GET /api` - API documentation
- `POST /api/ai/generate-response` - Generate AI responses
- `POST /api/ai/analyze-sentiment` - Analyze message sentiment
- `POST /api/ai/evaluate-response` - Evaluate response quality
- `POST /api/knowledge/search` - Search knowledge base

## Project Goals

1. **Primary Objective**: Production-ready customer support dashboard with GenAI integration
2. **Technical Demonstration**: OpenAI APIs, embeddings, prompt engineering, client-side AI
3. **Business Value**: Solve real customer support challenges
4. **Portfolio Enhancement**: Showcase GenAI experience for interviews

## Implementation Timeline

- **Phase 1**: Foundation (Hours 1-2) ✅
- **Phase 2**: Core AI Integration (Hours 3-5)
- **Phase 3**: Advanced Features (Hours 6-7)
- **Phase 4**: Polish & Demo (Hours 8-10)

## Next Steps

1. Implement core AI integration (OpenAI API, response generation)
2. Build chat interface components
3. Add sentiment analysis functionality
4. Implement knowledge base search
5. Create analytics dashboard
6. Add response quality scoring
7. Polish UI/UX and add demo scenarios

## Contributing

This is a demo project for portfolio purposes. The codebase follows modern React and Node.js best practices with comprehensive TypeScript coverage.

## License

MIT License - This is a demo project for educational and portfolio purposes.