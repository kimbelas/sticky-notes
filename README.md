# NoteSpace - Collaborative Digital Workspace

A real-time collaborative note-taking application built with Next.js, GraphQL, and MongoDB. NoteSpace allows teams to brainstorm, plan, and organize ideas together using digital sticky notes in shared workspaces.

## ✨ Features

- 🏠 **Workspace-Based Collaboration**: Join workspaces with unique 6-character codes
- 🔄 **Real-time Updates**: Instant synchronization across all connected users
- 🖱️ **Drag & Drop Interface**: Intuitive note positioning with smooth animations
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts**: Power user features (N for new note, Ctrl+Enter to save)
- 🎨 **Color-Coded Organization**: 7 vibrant colors for visual categorization
- 💾 **Auto-save**: Changes persist automatically as you type
- 🔒 **Privacy-First**: No account required, workspace codes keep notes private
- ♿ **Accessible**: WCAG compliant with full keyboard navigation
- 🚀 **Lightning Fast**: Built with Next.js Turbopack for optimal performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: GraphQL (Apollo Server), MongoDB with Mongoose
- **State Management**: Apollo Client for server state, Zustand for UI state
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel-optimized with edge functions support

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- MongoDB database (local or cloud instance)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/notespace.git
cd notespace
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:
```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/notespace
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notespace?retryWrites=true&w=majority

# Application URL (for SEO/meta tags)
NEXT_PUBLIC_URL=http://localhost:3000

# Optional: Node environment
NODE_ENV=development
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm test` | Run all test suites |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |

## 📖 Usage Guide

### Creating and Joining Workspaces

1. **Join Existing Workspace**: Enter the 6-character code shared with you
2. **Create New Workspace**: Click "Create New Workspace" for a unique code
3. **Share Workspace**: Copy the code from the workspace header to invite others

### Working with Notes

- **Create Note**: Click the + button or press 'N' anywhere
- **Edit Content**: Click on any note to start editing
- **Move Notes**: Click and drag to reposition (z-index automatically managed)
- **Change Colors**: Click the color picker on each note
- **Save Changes**: Auto-saves or use Ctrl+Enter for immediate save
- **Delete Notes**: Click the trash icon with confirmation

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `N` | Create new note |
| `Enter` | Save title (when focused) |
| `Ctrl/Cmd + Enter` | Save content |
| `Escape` | Cancel current edit |

## 🔌 API Documentation

### REST Endpoints

```bash
# Workspace Management
GET    /api/rooms/validate          # Generate new workspace code
POST   /api/rooms/validate          # Validate workspace exists
GET    /api/health                  # Health check endpoint

# Note Operations (REST)
GET    /api/rooms/[code]/notes      # Get all notes in workspace
POST   /api/rooms/[code]/notes      # Create new note
PUT    /api/rooms/[code]/notes      # Update existing note
DELETE /api/rooms/[code]/notes      # Delete note
```

### GraphQL API

**Endpoint**: `POST /api/graphql`

**Example Queries**:
```graphql
# Get workspace notes
query GetNotes($roomCode: String!) {
  roomNotes(roomCode: $roomCode) {
    id
    title
    content
    x
    y
    color
    createdAt
  }
}

# Create note
mutation CreateNote($roomCode: String!, $input: NoteInput!) {
  addRoomNote(roomCode: $roomCode, input: $input) {
    id
    title
    content
  }
}
```

## 🧪 Testing

### Test Structure
```
__tests__/
├── components/          # Component unit tests
│   ├── CodeEntry.test.tsx
│   ├── StickyNote.test.tsx
│   └── StickyBoard.test.tsx
├── pages/              # Page integration tests
│   └── room.test.tsx
└── api/                # API endpoint tests
    ├── validate.test.ts
    └── graphql.test.ts
```

### Running Tests
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🏗️ Architecture

### Data Models

**Note Schema**
```typescript
{
  id: string;          // Unique identifier
  roomCode: string;    // 6-character workspace code
  title: string;       // Note title
  content: string;     // Note content
  x: number;          // X position
  y: number;          // Y position
  color: string;      // Color theme
  createdAt: Date;    // Creation timestamp
}
```

**Room Schema**
```typescript
{
  code: string;        // 6-character unique code
  name?: string;       // Optional workspace name
  createdAt: Date;     // Creation timestamp
  lastActivity: Date;  // Last interaction
}
```

### Component Architecture

- **Layout Components**: App-wide layout with SEO optimization
- **CodeEntry**: Landing page for workspace access
- **StickyBoard**: Main workspace container with note management
- **StickyNote**: Individual note component with drag & edit capabilities
- **Custom Hooks**: Reusable logic for drag-drop and state management

### Performance Features

- 🚀 MongoDB indexes on roomCode for fast queries
- 💾 Apollo Client caching with optimistic updates
- 📦 Automatic code splitting and lazy loading
- 🖼️ Next.js Image optimization
- ⚡ Edge function support for global deployment

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
- Connect your GitHub repository
- Configure environment variables
- Deploy automatically

### Environment Variables (Production)
```env
MONGO_URI=your-production-mongodb-uri
NEXT_PUBLIC_URL=https://your-domain.com
NODE_ENV=production
```

### Other Platforms

NoteSpace can be deployed to any platform supporting Node.js:
- Railway
- Render
- Heroku
- AWS/Google Cloud/Azure
- Self-hosted VPS

## 🔒 Security

- No user accounts required - privacy by design
- Workspace codes are cryptographically random
- Environment variables for sensitive data
- MongoDB connection security with connection pooling
- XSS protection through React's built-in escaping
- CORS configured for production domains

## 🌍 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Chrome Mobile | Android 90+ |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check [CLAUDE.md](CLAUDE.md) for detailed setup
- **Issues**: Report bugs via [GitHub Issues](https://github.com/yourusername/notespace/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/yourusername/notespace/discussions)

## 🙏 Acknowledgments

- Built with Next.js, React, and MongoDB
- Inspired by physical sticky note collaboration
- Thanks to all contributors and testers

---

<p align="center">Made with ❤️ by the NoteSpace Team</p>
<p align="center">
  <a href="https://notespace.app">Website</a> •
  <a href="https://github.com/yourusername/notespace">GitHub</a> •
  <a href="https://twitter.com/notespace">Twitter</a>
</p>