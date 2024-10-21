// src/api/API.ts

import { GET_ME } from '../utils/queries';
import { CREATE_USER, LOGIN_USER, SAVE_BOOK, DELETE_BOOK } from '../utils/mutations';
import type { User } from '../models/User.js';
import type { Book } from '../models/Book.js';

export const getMe = async (token: string) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: GET_ME }),
  });

  return response.json();
};

export const createUser = async (userData: User) => {
  const variables = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  };

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: CREATE_USER, variables }),
  });

  return response.json();
};

export const loginUser = async (userData: User) => {
  const variables = {
    email: userData.email,
    password: userData.password,
  };

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: LOGIN_USER, variables }),
  });

  return response.json();
};

export const saveBook = async (bookData: Book, token: string) => {
  const variables = {
    book: {
      bookId: bookData.bookId,
      title: bookData.title,
      authors: bookData.authors,
      description: bookData.description,
      image: bookData.image,
      link: bookData.link,
    },
  };

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: SAVE_BOOK, variables }),
  });

  return response.json();
};

export const deleteBook = async (bookId: string, token: string) => {
  const variables = { bookId };

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: DELETE_BOOK, variables }),
  });

  return response.json();
};
