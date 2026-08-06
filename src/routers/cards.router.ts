import { randomUUID } from 'crypto';
import express, { Request, Response } from 'express';
import {
  createCard,
  deleteCard,
  getManyCard,
  getOneCard,
  updateCard,
} from '../database/cards-repository';
import { Card, CreateCardRequest, GetCardsResponse } from '../types/cards';

import { CardIdParams } from '../types/common';
import { validateCardInput } from './validation/validate-card-input';

export const cardsRouter = express.Router();

cardsRouter.get(
  '/',
  async (req: Request<{}, {}>, res: Response<GetCardsResponse>) => {
    const cards = await getManyCard();
    res.send(cards);
  },
);

cardsRouter.get(
  '/:cardId',
  async (req: Request<CardIdParams, {}>, res: Response<Card | string>) => {
    const card = await getOneCard(req.params.cardId);

    if (!card) {
      res.status(404).send('Card not found ');
      return;
    }

    res.send(card);
  },
);

cardsRouter.post(
  '/',
  validateCardInput,
  async (req: Request<{}, Card, CreateCardRequest>, res: Response<Card>) => {
    const card: Card = {
      text: req.body.text,
      id: randomUUID(),
    };

    await createCard(card);

    res.send(card);
  },
);

cardsRouter.put(
  '/:cardId',
  validateCardInput,
  async (
    req: Request<CardIdParams, Card, CreateCardRequest>,
    res: Response<Card>,
  ) => {
    const card = {
      id: req.params.cardId,
      text: req.body.text,
    };

    await updateCard(card);
    res.send(card);
  },
);

cardsRouter.delete(
  '/:cardId',
  async (req: Request<CardIdParams>, res: Response<void>) => {
    await deleteCard(req.params.cardId);
    res.sendStatus(204);
  },
);
