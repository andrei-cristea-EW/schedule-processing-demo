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

This is a **React 19 + TypeScript + Vite** schedule processing application for TV schedule validation and analysis using AI validation services.

### Key Architecture Patterns

**API Integration**: The app connects to an external AI service (Integrail.ai) using an async execution pattern:
1. Submit schedule inputs to AI service via POST to `/{ACCOUNT_ID}/agent/{AGENT_ID}/execute`
2. Poll for completion using execution ID via GET to `/{ACCOUNT_ID}/agent/{executionId}/status`
3. Poll every 5 seconds indefinitely until finished or failed (no timeout)
4. Handle execution statuses: 'queued', 'running', 'finished', 'failed'
5. Extract validation results from nested `execution.outputs.warnings` and summary from `execution.outputs.summary`

**Component Structure**:
- `App.tsx` - Main application wrapper with main-card layout
- `ScheduleInterface.tsx` - Main container managing form submission, status tracking, and results display
- `ScheduleForm.tsx` - Input form for validation parameters (userId, inputFolder, outputFile, msToken)
- `ValidationResults.tsx` - Results container with SharePoint button integration
- `ValidationSummary.tsx` - Badge-style pills displaying validation statistics
- `WarningsTable.tsx` - Tabular display of validation warnings and errors
- `MarkdownRenderer.tsx` - Configurable markdown rendering with custom components
- `MarkdownSummary.tsx` - AI-generated summary display using markdown
- `Header.tsx` - Application header for schedule processing theme
- `services/api.ts` - API service layer with Axios client and infinite polling logic

**State Management**: Uses React hooks for local state management. Status tracking, validation results, and error states are managed in ScheduleInterface component with real-time updates during AI processing.

**Data Flow**: 
- User submits form parameters via ScheduleForm
- API execution starts and status is tracked with real-time updates
- Validation results are extracted from nested outputs structure when finished
- Badge summary, warnings table, and markdown summary are displayed
- SharePoint button provides external access to processed data

### Environment Configuration

The application requires these environment variables:
- `VITE_API_BASE_URL` - Base URL for AI service API
- `VITE_API_TOKEN` - Authentication token for AI service
- `VITE_ACCOUNT_ID` - Account identifier for API calls
- `VITE_AGENT_ID` - AI agent identifier for schedule processing

### TypeScript Configuration

The project uses TypeScript with ES2022 target and project references:
- `tsconfig.json` - Root configuration with project references
- `tsconfig.app.json` - Application-specific config
- `tsconfig.node.json` - Node.js tooling config
All API interfaces are defined in `src/types/api.ts`. Key interfaces include:
- `ScheduleInputs` - Form submission parameters
- `ValidationWarning` - Individual validation issue with row, field, message, severity
- `ValidationSummary` - Statistics summary with total rows, warnings count, errors count
- `ValidationResults` - Complete results structure with warnings array, summary, and markdown content

### API Response Structure

The application handles nested API responses with this structure:
```typescript
execution.outputs: {
  warnings: {
    warnings: ValidationWarning[],
    validationSummary: ValidationSummary
  },
  summary: string // Markdown formatted AI analysis
}
```

### UI Components and Features

**Badge Summary Pills**: Three colored badges displaying:
- Total Rows (blue) - `badge-rows`
- Warnings Count (orange) - `badge-warnings`  
- Errors Count (red) - `badge-errors`

**SharePoint Integration**: Direct link button ("📊 View in SharePoint") to external Excel file for detailed analysis.

**Warnings Table**: Sortable table displaying:
- Row number, Field name, Index, Message, Severity
- Color-coded severity badges (warning/error)
- Responsive design with horizontal scrolling

**Markdown Processing**: Uses `react-markdown` with `remark-gfm` for:
- AI-generated summaries with custom styling
- Code blocks, tables, lists, headers
- Custom component mapping for consistent theming

### Development Notes

- Uses Axios for AI API requests with Bearer token authentication
- Infinite polling until execution completion (no timeout restrictions)
- Loading states managed through React state with real-time status updates
- Error handling displays user-friendly messages for API failures
- Form validation ensures required fields are completed before submission
- MS Token is optional and filtered out if empty during API submission

### Styling and CSS

- Uses custom CSS with CSS variables for consistent theming
- Dark theme with blue/purple gradient background
- Component-specific styling with BEM-style naming conventions
- Responsive design with mobile-first approach
- Badge/pill components for statistics display
- Table styling with hover states and color-coded severity indicators

### Deployment Configuration

- Configured for GitHub Pages deployment with conditional base path
- Base path is `/schedule-processing-demo/` in production, `/` in development
- Production builds use Vite's static asset optimization
- Build output goes to `dist/` directory

### Testing

No test framework is currently configured. When adding tests, check the project needs and set up appropriate testing tools (Jest, Vitest, etc.).