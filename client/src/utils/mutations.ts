// src/graphql/mutations.ts

export const CREATE_USER = `
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN_USER = `
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SAVE_BOOK = `
  mutation($book: BookInput!) {
    saveBook(book: $book) {
      _id
      username
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const DELETE_BOOK = `
  mutation($bookId: String!) {
    deleteBook(bookId: $bookId) {
      _id
      username
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;
