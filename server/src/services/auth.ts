import jwt, { JwtPayload as JwtPayloadType } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}


export const authenticateToken = (authHeader: string | undefined) => {
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    try {
      
      const user = jwt.verify(token, secretKey) as JwtPayload;

      return user; 
    } catch (err) {
      console.error('Invalid token', err);
      throw new Error('Invalid or expired token');
    }
  }
  throw new Error('Authorization token is required');
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload: JwtPayload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
