import { Request, Response } from 'express';
import { Column, CreateColumnRequest } from '../../types/columns';

export const validateColumnInput = (
  { body }: Request<unknown, Column, CreateColumnRequest>,
  response: Response,
  next: () => void,
): void => {
  if (typeof body !== 'object' || !body.name || typeof body.name !== 'string') {
    response.status(400).send({
      error: 'Validate Error',
    });

    return;
  }

  next();
};
