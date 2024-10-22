import express from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { Request, Response } from 'express';
import { authenticateToken } from './services/auth.js';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile('../client/dist/index.html');
});

}

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    
    console.error(err);
    return {
      message: err.message,
    };
  },
});

const startApolloServer = async () => {
  await server.start();
  app.use('/graphql', expressMiddleware(server, { context: authenticateToken}));

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
};

startApolloServer();
