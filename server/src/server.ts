import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js'; // Import your typeDefs and resolvers
import routes from './routes/index.js'; // Optional, if you want to keep REST endpoints

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start(); // Start Apollo Server
  app.use('/graphql', expressMiddleware(server)); // Attach it as middleware

  // Optional: Keep REST routes if necessary
  // app.use(routes);

  // MongoDB connection
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
};

startApolloServer();
