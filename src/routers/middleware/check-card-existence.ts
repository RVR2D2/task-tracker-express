import { NextFunction, Request, Response } from 'express';
import { getOneCard } from '../../database/cards-repository';
import { CardIdParams } from '../../types/common';

export const checkCardExistence = async (
  { params }: Request<CardIdParams>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const card = await getOneCard(params);

  if (card) {
    next();
    return;
  }

  response.status(404).send('Card not found');
};
