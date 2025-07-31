// src/graphql/queries.ts

import { gql } from '@apollo/client';

export const GET_NOTES = gql`
  query {
    notes {
      id
      roomCode
      title
      content
      x
      y
      color
      createdAt
    }
  }
`;

export const GET_ROOM_NOTES = gql`
  query GetRoomNotes($roomCode: String!) {
    roomNotes(roomCode: $roomCode) {
      id
      roomCode
      title
      content
      x
      y
      color
      createdAt
    }
  }
`;

export const VALIDATE_ROOM = gql`
  query ValidateRoom($code: String!) {
    validateRoom(code: $code) {
      code
      name
      createdAt
      lastActivity
    }
  }
`;

export const ADD_NOTE = gql`
  mutation($input: NoteInput!) {
    addNote(input: $input) {
      id
      roomCode
      title
      content
      x
      y
      color
      createdAt
    }
  }
`;

export const ADD_ROOM_NOTE = gql`
  mutation AddRoomNote($roomCode: String!, $input: RoomNoteInput!) {
    addRoomNote(roomCode: $roomCode, input: $input) {
      id
      roomCode
      title
      content
      x
      y
      color
      createdAt
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation($input: NoteInput!) {
    updateNote(input: $input) {
      id
      roomCode
      title
      content
      x
      y
      color
      createdAt
    }
  }
`;

export const UPDATE_ROOM_NOTE = gql`
  mutation UpdateRoomNote($roomCode: String!, $noteId: ID!, $input: RoomNoteInput!) {
    updateRoomNote(roomCode: $roomCode, noteId: $noteId, input: $input) {
      id
      roomCode
      title
      content
      x
      y
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

export const DELETE_ROOM_NOTE = gql`
  mutation DeleteRoomNote($roomCode: String!, $noteId: ID!) {
    deleteRoomNote(roomCode: $roomCode, noteId: $noteId)
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($code: String) {
    createRoom(code: $code) {
      code
      name
      createdAt
      lastActivity
    }
  }
`;
