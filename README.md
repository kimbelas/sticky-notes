# Room-Based Sticky Notes App

A collaborative sticky notes application built with Next.js, GraphQL, and MongoDB. Users can join rooms with 6-character codes to share and collaborate on sticky notes in real-time.

## Features

- 🏠 **Room-Based Access**: Enter 6-character room codes to access shared boards
- 🔄 **Real-time Collaboration**: Share room codes for instant collaboration
- 🖱️ **Drag & Drop**: Smooth note positioning with visual feedback
- 📱 **Mobile Responsive**: Touch-friendly interactions on all devices
- ⌨️ **Keyboard Shortcuts**: 'N' for new note, Ctrl+Enter to save, Escape to cancel
- 🎨 **Color Themes**: Multiple color options for organizing notes
- 💾 **Auto-save**: Changes are automatically saved as you type
- 🔒 **Local Storage**: Remembers your last room code
- ♿ **Accessible**: Full keyboard navigation and screen reader support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: GraphQL with Apollo Server, MongoDB with Mongoose
- **State Management**: Apollo Client for server state
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud like MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd next-graphql-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/StickyNotes
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/StickyNotes
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Usage

### Creating/Joining Rooms

1. **Join Existing Room**: Enter a 6-character alphanumeric code
2. **Create New Room**: Click "Create New Room" to generate a unique code
3. **Share Room**: Copy the room code from the header to invite collaborators

### Managing Notes

- **Create**: Click the + button or press 'N'
- **Edit**: Click on title or content to edit inline
- **Move**: Click and drag notes to reposition
- **Color**: Click the color circle to change note color
- **Save**: Changes auto-save, or use Ctrl+Enter
- **Delete**: Click the trash icon (with confirmation)

### Keyboard Shortcuts

- `N` - Create new note
- `Enter` - Save title changes
- `Ctrl+Enter` / `Cmd+Enter` - Save content changes
- `Escape` - Cancel changes

## API Routes

### REST Endpoints

- `GET /api/rooms/validate` - Generate new room code
- `POST /api/rooms/validate` - Validate room code
- `GET /api/rooms/[code]/notes` - Get room notes
- `POST /api/rooms/[code]/notes` - Create note in room
- `PUT /api/rooms/[code]/notes` - Update note
- `DELETE /api/rooms/[code]/notes` - Delete note

### GraphQL Endpoint

- `POST /api/graphql` - GraphQL API for all note operations

## Testing

The project includes comprehensive tests covering:

- **Unit Tests**: Individual components and functions
- **Integration Tests**: API routes and database operations
- **Component Tests**: React component behavior and user interactions

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
__tests__/
├── components/          # Component tests
│   ├── CodeEntry.test.tsx
│   └── StickyNote.test.tsx
├── pages/              # Page tests
│   └── room.test.tsx
└── api/                # API tests
    └── validate.test.ts
```

## Architecture

### Data Models

**Note Model**:
```javascript
{
  id: String (unique),
  roomCode: String (6-char, indexed),
  title: String,
  content: String,
  x: Number (position),
  y: Number (position),
  color: String,
  createdAt: Date
}
```

**Room Model**:
```javascript
{
  code: String (6-char, unique),
  name: String (optional),
  createdAt: Date,
  lastActivity: Date
}
```

### Component Architecture

- **CodeEntry**: Landing page with room code validation
- **StickyBoard**: Main collaborative board container
- **StickyNote**: Individual draggable note component
- **Custom Hooks**: Reusable drag & drop functionality

### Key Features

- **Room Validation**: 6-character alphanumeric codes with format validation
- **Auto-creation**: Rooms are created automatically when valid codes are entered
- **Activity Tracking**: Rooms track last activity for cleanup/analytics
- **Position Persistence**: Note positions are saved to database
- **Smooth Animations**: CSS transitions for all interactions
- **Error Handling**: Comprehensive error states and user feedback

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```env
MONGO_URI=your-mongodb-connection-string
```

## Performance Optimizations

- **Database Indexing**: Compound indexes on roomCode for fast queries
- **Client-side Caching**: Apollo Client caching for GraphQL responses
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js built-in image optimization
- **Bundle Analysis**: Webpack bundle analyzer integration

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section in CLAUDE.md

---

Built with ❤️ using Next.js, GraphQL, and MongoDB