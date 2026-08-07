import { randomUUID } from 'crypto';
import express, { Request, Response } from 'express';
import {
  createCard,
  deleteCard,
  getManyCard,
  getOneCard,
  updateCard,
} from '../database/cards-repository';
import {
  Card,
  CreateCardRequest,
  GetCardsResponse,
  UpdateCardRequest,
} from '../types/cards';

import { getOneColumn } from '../database/columns-repository';
import { CardIdParams, ColumnIdParams } from '../types/common';
import { checkCardExistence, checkColumnExistence } from './middleware';
import { validateCardInput } from './validation/validate-card-input';

export const cardsRouter = express.Router({ mergeParams: true });

cardsRouter.get(
  '/',
  async (req: Request<ColumnIdParams, {}>, res: Response<GetCardsResponse>) => {
    const cards = await getManyCard(req.params);
    res.send(cards);
  },
);

cardsRouter.get(
  '/:cardId',
  async (req: Request<CardIdParams, {}>, res: Response<Card | string>) => {
    const card = await getOneCard(req.params);

    if (!card) {
      res.status(404).send('Card not found ');
      return;
    }

    res.send(card);
  },
);

cardsRouter.post(
  '/',
  checkColumnExistence,
  validateCardInput,
  async (
    req: Request<ColumnIdParams, Card, CreateCardRequest>,
    res: Response<Card>,
  ) => {
    const card: Card = {
      text: req.body.text,
      id: randomUUID(),
      columnId: req.params.columnId,
    };

    await createCard(card);

    res.send(card);
  },
);

cardsRouter.put(
  '/:cardId',
  validateCardInput,
  checkCardExistence,
  async (
    { body, params }: Request<CardIdParams, Card, UpdateCardRequest>,
    res: Response<Card | string>,
  ) => {
    if (params.columnId !== body.columnId) {
      const column = await getOneColumn(body.columnId, params.boardId);

      if (!column) {
        res.status(404).send('Column not found');
        return;
      }
    }

    const card: Card = {
      id: params.cardId,
      text: body.text,
      columnId: body.columnId,
    };

    await updateCard(card);
    res.send(card);
  },
);

cardsRouter.delete(
  '/:cardId',
  checkCardExistence,
  async (req: Request<CardIdParams>, res: Response<void>) => {
    await deleteCard(req.params.cardId);
    res.sendStatus(204);
  },
);
