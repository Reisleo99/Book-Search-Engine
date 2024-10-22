import { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client'; // Apollo hooks
import { GET_ME } from '../utils/queries'; // Import the GET_ME query
import { DELETE_BOOK } from '../utils/mutations'; // Import the REMOVE_BOOK mutation
import type { User } from '../models/User';

const SavedBooks = () => {
  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  const { loading, data } = useQuery(GET_ME, {
    onCompleted: (data) => {
      if (data?.me) {
        setUserData(data.me); // Update the state with the user data from the query
      }
    },
    onError: (error) => console.error(error),
  });

  const [removeBook] = useMutation(DELETE_BOOK, {
    onCompleted: (data) => {
      if (data?.removeBook) {
        setUserData(data.removeBook); // Update the user data after deleting the book
      }
    },
    onError: (error) => console.error(error),
  });

  // Create function that accepts the book's mongo _id value as param and deletes the book using the mutation
  const handleDeleteBook = async (bookId: string) => {
    try {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }

      await removeBook({
        variables: { bookId }, // Pass bookId as a variable to the mutation
      });

      // Upon success, remove the book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // If data is still loading, show a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
