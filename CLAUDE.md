# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development server with hot reload (runs on http://localhost:5173)
npm run dev

# Build for production (includes TypeScript compilation)
npm run build

# Type checking (run before builds)
tsc -b

# Lint code
npm run lint

# Preview production build locally
npm run preview
```

## Project Architecture

This is a **React 19 + TypeScript + Vite** validation interface application for schedule processing using AI validation services.

### Key Architecture Patterns

**API Integration**: The app connects to an external AI service (Integrail.ai) using an async execution pattern:
1. Submit user message to AI service via POST to `/{ACCOUNT_ID}/agent/{AGENT_ID}/execute`
2. Poll for completion using execution ID via GET to `/{ACCOUNT_ID}/agent/{executionId}/status`
3. Poll every 5 seconds for up to 60 attempts (5 minutes max timeout)
4. Handle execution statuses: 'queued', 'running', 'finished', 'failed'
5. Extract AI response from `execution.outputs.aianswer` when finished

**Component Structure**:
- `ChatInterface.tsx` - Main chat container with message history state and welcome screen
- `MessageInput.tsx` - Handles user input with keyboard shortcuts and file attachments (Enter to send, Shift+Enter for new line)
- `MessageBubble.tsx` - Individual message rendering with loading states and file attachment display
- `LoadingIndicator.tsx` - Loading animation component
- `Header.tsx` - Application header component
- `services/api.ts` - API service layer with Axios client and polling logic
- `services/fileUpload.ts` - File upload service for handling file attachments

**State Management**: Uses React hooks for local state management. Message history is maintained in ChatInterface component state with real-time updates during AI processing.

### Environment Configuration

The application requires these environment variables:
- `VITE_API_BASE_URL` - Base URL for AI service API
- `VITE_API_TOKEN` - Authentication token
- `VITE_ACCOUNT_ID` - Account identifier
- `VITE_AGENT_ID` - AI agent identifier
- `VITE_FILE_UPLOAD_TOKEN` - Token for file upload service (optional)

### TypeScript Configuration

The project uses strict TypeScript with ES2022 target. All API interfaces are defined in `src/types/api.ts`. When adding new API endpoints or modifying data structures, update the type definitions there first.

### File Upload Feature

The application supports optional file attachments with messages:
- Files are uploaded to `https://staging-storage-service.integrail.ai/api/upload` with 3000-minute TTL
- Upload service requires `VITE_FILE_UPLOAD_TOKEN` environment variable
- Supported file types: All file types accepted (`accept="*/*"`)
- File data is passed to AI agent as `file` parameter alongside `userPrompt`
- File attachments are displayed in user messages with download links
- Upload progress and error states are handled with visual feedback

### Development Notes

- The app uses Axios for HTTP requests with Bearer token authentication
- Loading states are managed through React state and displayed via LoadingIndicator component
- Auto-scrolling to latest messages is implemented using useRef and useEffect
- Message IDs are generated using timestamp + random string for uniqueness
- Error handling displays fallback messages when API calls fail
- File uploads use native fetch API with FormData for multipart uploads

### Styling and CSS

- Uses standard CSS with custom classes (no CSS-in-JS or styled-components)
- Main styles in `src/App.css` and `src/index.css`
- Component-specific styling using className props
- Responsive design with mobile-friendly chat interface

### Deployment Configuration

- Configured for GitHub Pages deployment with base path `/schedule-processing-demo/`
- Production builds use Vite's static asset optimization
- Build output goes to `dist/` directory
- Base path is conditionally set based on NODE_ENV

### Testing

No test framework is currently configured. When adding tests, check the project needs and set up appropriate testing tools (Jest, Vitest, etc.).