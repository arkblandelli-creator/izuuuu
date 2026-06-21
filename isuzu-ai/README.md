# Izusu ai

A premium, production-ready AI assistant platform with luxurious white-gold-violet branding. Supports ChatGPT, Claude, and Gemini AI modes with full chat history, file uploads, and elegant animations.

## Features

- **Multi-AI Mode Selector**: Switch between ChatGPT, Claude, and Gemini with animated transitions and distinct badge colors.
- **Chat History Management**: Create, rename, delete, search, and persist conversations in localStorage.
- **File & Image Upload**: Drag-and-drop support, image previews, file previews, and multiple file attachments.
- **Voice Input**: Browser-based speech recognition (Web Speech API) for hands-free messaging.
- **Markdown & Code Rendering**: Full markdown support with syntax-highlighted code blocks and copy-to-clipboard.
- **Edit & Regenerate**: Edit your messages and regenerate AI responses on demand.
- **Streaming Effect**: Simulated streaming response effect with smooth word-by-word reveals.
- **Premium Animations**: Gold shimmer, violet glow particles, floating UI effects, and luxury transitions.
- **Fully Responsive**: Mobile-first design with collapsible sidebar and adaptive layout.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd isuzu-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Configuration

### Replace the Avatar

The default avatar is located at:

```
public/avatar.png
```

Replace this file with your own image to customize the Izusu ai avatar. The design preserves image quality and applies a circular premium frame with soft gold glow and violet ambient lighting via CSS.

### AI Endpoints

The app routes to three external AI endpoints based on the selected mode:

| Mode | Endpoint |
|------|----------|
| ChatGPT | `https://api.synoxcloud.xyz/ai-chat/gpt-5.5?text={message}` |
| Claude | `https://api.xvortex.my.id/api/ai/claude?message={message}` |
| Gemini | `https://api.xvortex.my.id/api/ai/gemini?text={message}` |

**Note:** These are third-party endpoints. CORS or availability issues may occur in production. The app handles errors gracefully with retry-friendly UI states.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Markdown**: react-markdown + react-syntax-highlighter
- **Icons**: Lucide React
- **Storage**: localStorage (chat history persistence)

## Project Structure

```
isuzu-ai/
├── app/
│   ├── components/          # All UI components (modular)
│   ├── hooks/              # Custom React hooks (useChatHistory, useLocalStorage, useMediaQuery)
│   ├── lib/                # API callers and utilities
│   ├── types/              # TypeScript type definitions
│   ├── globals.css         # Global styles + Tailwind directives
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application page
├── public/
│   └── avatar.png          # Izusu ai avatar (replaceable)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Limitations & Notes

- **File Analysis**: The provided AI endpoints are text-only GET APIs. File attachments are displayed in the UI but their content is not sent to the AI backend. To enable true file analysis, a backend proxy or multimodal API integration is required.
- **Voice Input**: Depends on the browser's Web Speech API (Chrome/Edge supported best).
- **API Reliability**: External third-party endpoints may experience downtime, rate limits, or CORS restrictions. The app surfaces errors clearly and allows retrying.

## License

MIT — Free to use and modify.
