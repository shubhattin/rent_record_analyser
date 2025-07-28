import { z } from 'zod';

export const JWT_SECRET = (() => {
  const token = process.env.JWT_SECRET;
  const jwt_token_parse = z.string().safeParse(token);
  if (!jwt_token_parse.success) throw new Error('Please set `JWT_SECRET`');
  return new TextEncoder().encode(jwt_token_parse.data);
})();
