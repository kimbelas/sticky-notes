import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Note {
    id: ID!
    roomCode: String!
    title: String
    content: String
    x: Float
    y: Float
    color: String
    createdAt: String
  }

  type Room {
    code: String!
    name: String
    createdAt: String
    lastActivity: String
  }

  input NoteInput {
    id: ID!
    roomCode: String!
    title: String
    content: String
    x: Float
    y: Float
    color: String
  }

  input RoomNoteInput {
    title: String
    content: String
    x: Float
    y: Float
    color: String
  }

  type Query {
    notes: [Note!]!
    roomNotes(roomCode: String!): [Note!]!
    validateRoom(code: String!): Room
  }

  type Mutation {
    addNote(input: NoteInput!): Note
    updateNote(input: NoteInput!): Note
    deleteNote(id: ID!): Boolean
    addRoomNote(roomCode: String!, input: RoomNoteInput!): Note
    updateRoomNote(roomCode: String!, noteId: ID!, input: RoomNoteInput!): Note
    deleteRoomNote(roomCode: String!, noteId: ID!): Boolean
    createRoom(code: String): Room
  }
`;
