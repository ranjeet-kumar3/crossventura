import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

/**
 * Generates a JWT token for a user.
 * @param payload The data to encode in the token.
 * @param expiresIn The expiration time (e.g., '1h', '7d'). Defaults to '7d'.
 * @returns The generated JWT token.
 */
export const generateToken = (payload: any, expiresIn: any = '7d'): string => {
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Verifies a JWT token.
 * @param token The token to verify.
 * @returns The decoded payload if valid, otherwise throws an error.
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
