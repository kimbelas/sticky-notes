import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Note {
    id: ID!
    title: String
    content: String
    color: String
    createdAt: String
  }

  input NoteInput {
    id: ID!
    title: String
    content: String
    color: String
  }

  type Query {
    notes: [Note!]!
  }

  type Mutation {
    addNote(input: NoteInput!): Note
    updateNote(input: NoteInput!): Note
    deleteNote(id: ID!): Boolean
  }
`;
