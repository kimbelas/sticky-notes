// src/graphql/queries.ts

import { gql } from '@apollo/client';

export const GET_NOTES = gql`
  query {
    notes {
      id
      title
      content
      color
      createdAt
    }
  }
`;

export const ADD_NOTE = gql`
  mutation($input: NoteInput!) {
    addNote(input: $input) {
      id
      title
      content
      color
      createdAt
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation($input: NoteInput!) {
    updateNote(input: $input) {
      id
      title
      content
      color
      createdAt
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation($id: ID!) {
    deleteNote(id: $id)
  }
`;
