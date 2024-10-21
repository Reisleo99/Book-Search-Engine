import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (context.user) {
        const foundUser = await User.findOne({
          $or: [{ _id: context.user._id }, { username: context.user.username }],
        });

        if (!foundUser) {
          throw new AuthenticationError('Cannot find a user with this id!');
        }
        return foundUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new AuthenticationError('Something went wrong!');
      }

      const token = signToken(username, email, user._id);
      return { token, user };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ $or: [{ username: email }, { email }] });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user.username, email, user._id);
      return { token, user };
    },

    saveBook: async (_: any, { input }: any, context: any) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: input } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        } catch (err) {
          throw new AuthenticationError('Failed to save the book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (_: any, { bookId }: any, context: any) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new AuthenticationError("Couldn't find user with this id!");
        }

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;
