# PyGent Factory UI

A modern, responsive React-based user interface for the PyGent Factory AI reasoning system.

## Features

### 🤖 Multi-Agent Chat Interface
- Real-time conversations with specialized AI agents
- Support for reasoning, evolution, search, and general agents
- Rich message rendering with markdown and code highlighting
- Typing indicators and real-time message streaming

### 🧠 Tree of Thought Reasoning
- Interactive visualization of reasoning paths
- Real-time thought tree updates
- Confidence scoring and path exploration
- Detailed reasoning step analysis

### 🧬 Recipe Evolution Monitoring
- Live evolution progress tracking
- Fitness progression charts
- Population diversity visualization
- Convergence metrics and analysis

### 🔍 Vector Search Interface
- GPU-accelerated search performance monitoring
- Index management and optimization
- Real-time search metrics
- Result visualization with similarity scoring

### 📊 System Monitoring
- Real-time CPU, Memory, and GPU utilization
- AI component performance tracking
- Network and system health monitoring
- Automated alerting and notifications

### 🛒 MCP Marketplace
- Model Context Protocol server discovery
- One-click server installation and management
- Health monitoring and auto-restart
- Performance benchmarking

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **UI Components**: Radix UI + Tailwind CSS
- **Real-time Communication**: WebSocket
- **Data Visualization**: Recharts + D3.js
- **Build Tool**: Vite
- **Code Quality**: ESLint + TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PyGent Factory backend running on port 8000

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
ui/
├── src/
│   ├── components/          # React components
│   │   ├── chat/           # Chat interface components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Reusable UI components
│   ├── pages/              # Page components
│   ├── stores/             # Zustand state management
│   ├── services/           # API and WebSocket services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── dist/                   # Build output
```

## Key Components

### Chat Interface (`src/components/chat/`)
- **ChatInterface**: Main chat component with agent selection
- **MessageList**: Message rendering with rich content support
- **AgentSelector**: Dropdown for selecting AI agents
- **ReasoningPanel**: Side panel for reasoning visualization

### Layout (`src/components/layout/`)
- **AppLayout**: Main application layout wrapper
- **Sidebar**: Navigation sidebar with system status
- **Header**: Top navigation with user menu and notifications

### State Management (`src/stores/`)
- **appStore**: Global application state using Zustand
- Modular selectors for different feature areas
- Persistent storage for user preferences

### Services (`src/services/`)
- **websocket**: Real-time WebSocket communication
- Event-driven architecture for AI component updates
- Connection management and error handling

## Configuration

### Environment Variables

Create a `.env` file in the ui directory:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Proxy Configuration

The Vite development server is configured to proxy API requests to the backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:8000',
    '/ws': {
      target: 'ws://localhost:8000',
      ws: true
    }
  }
}
```

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint with React and TypeScript rules
- Prettier for code formatting
- Tailwind CSS for styling

### Component Guidelines

1. **Use TypeScript**: All components should be typed
2. **Functional Components**: Use React functional components with hooks
3. **Props Interface**: Define clear interfaces for component props
4. **Error Boundaries**: Implement error handling for robust UX
5. **Accessibility**: Follow WCAG guidelines for accessibility

### State Management

- Use Zustand for global state
- Create focused selectors for component needs
- Implement optimistic updates for better UX
- Handle loading and error states consistently

## WebSocket Integration

The UI connects to the backend via WebSocket for real-time updates:

```typescript
// Event types supported
- chat_message / chat_response
- reasoning_update / reasoning_complete
- evolution_progress / evolution_complete
- system_metrics / system_alert
- mcp_server_status / mcp_server_health
```

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar for mobile
- Touch-optimized controls
- Progressive disclosure for complex interfaces

## Performance Optimization

- Code splitting with React.lazy()
- Memoization for expensive computations
- Virtual scrolling for large lists
- Debounced search inputs
- Optimized re-renders with React.memo()

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Deployment

### Static Hosting

Build the application and deploy the `dist` folder:

```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the PyGent Factory system. See the main repository for license information.
