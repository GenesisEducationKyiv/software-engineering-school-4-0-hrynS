import { Request, Response } from 'express';
import createError from 'http-errors';

export const errorHandler = (err: unknown, req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, err);

  if (createError.isHttpError(err)) {
    res.status(err.status).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};
