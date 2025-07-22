# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Type checking (run before builds)
tsc -b

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

This is a **React 19 + TypeScript + Vite** chat interface application for SA Fire Protection's AI customer support system.

### Key Architecture Patterns

**API Integration**: The app connects to an external AI service (Integrail.ai) using an async execution pattern:
1. Submit user message to AI service
2. Poll for completion using execution ID
3. Stream results back to chat interface

**Component Structure**:
- `ChatInterface.tsx` - Main chat container with message history state
- `MessageInput.tsx` - Handles user input with keyboard shortcuts (Enter to send, Shift+Enter for new line)
- `MessageBubble.tsx` - Individual message rendering
- `services/api.ts` - API service layer with polling logic

**State Management**: Uses React hooks for local state management. Message history is maintained in ChatInterface component state with real-time updates during AI processing.

### Environment Configuration

The application requires these environment variables:
- `VITE_API_BASE_URL` - Base URL for AI service API
- `VITE_API_TOKEN` - Authentication token
- `VITE_ACCOUNT_ID` - Account identifier
- `VITE_AGENT_ID` - AI agent identifier

### TypeScript Configuration

The project uses strict TypeScript with ES2022 target. All API interfaces are defined in `src/types/api.ts`. When adding new API endpoints or modifying data structures, update the type definitions there first.

### Development Notes

- The app uses Axios for HTTP requests with proper error handling
- Loading states are managed through React state and displayed via LoadingIndicator component
- Auto-scrolling to latest messages is implemented using useRef and useEffect
- GitHub Actions workflow handles automated deployment to GitHub Pages

### Testing

No test framework is currently configured. When adding tests, check the project needs and set up appropriate testing tools (Jest, Vitest, etc.).