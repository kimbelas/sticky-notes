# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs with turbopack)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Architecture Overview

This is a Next.js application with GraphQL API that manages sticky notes. It uses:

### Core Technologies
- **Next.js 15** with App Router and Pages Router hybrid approach
- **GraphQL** with Apollo Server for API layer
- **MongoDB** with Mongoose for data persistence
- **Apollo Client** for GraphQL client-side operations
- **Zustand** for client-side state management
- **TypeScript** and JavaScript mixed codebase
- **Tailwind CSS** for styling

### Key Architecture Patterns

**GraphQL API Structure**:
- GraphQL endpoint: `/api/graphql` (in `pages/api/graphql.ts`)
- Schema definitions: `app/api/schemas.ts`
- Resolvers: `app/api/resolvers.js`
- MongoDB models: `models/Note.js`

**State Management**:
- Server state: GraphQL queries/mutations via Apollo Client
- Client state: Zustand store (`src/store/noteStore.ts`)
- Apollo Client configuration: `lib/apolloClient.ts`

**Data Flow**:
1. Frontend components query GraphQL via Apollo Client
2. GraphQL resolvers interact with MongoDB via Mongoose
3. Local state managed by Zustand for UI interactions
4. Note model handles CRUD operations with unique ID field

**MongoDB Connection**:
- Requires `MONGO_URI` environment variable in `.env.local`
- Database name: 'StickyNotes'
- Connection handled in GraphQL endpoint with connection reuse

**File Structure Notes**:
- Mixed App Router (`app/`) and Pages Router (`pages/`) - GraphQL API uses Pages Router
- Client-side GraphQL queries in `src/graphql/queries.ts`
- TypeScript config allows mixed JS/TS files
- ESLint configured with Next.js core web vitals

**Development**:
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.
