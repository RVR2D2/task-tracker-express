import { randomUUID } from 'crypto';
import express, { Request, Response } from 'express';
import {
  createBoard,
  deleteBoard,
  getManyBoard,
  getOneBoard,
  updateBoard,
} from '../database/boards-repository';
import { Board, CreateBoardRequest, GetBoardsResponse } from '../types/boards';
import { IdParams } from '../types/common';
import { validateBoardInput } from './validation';

export const boardsRouter = express.Router();

boardsRouter.get(
  '/',
  async (req: Request<{}, {}>, res: Response<GetBoardsResponse>) => {
    const boards = await getManyBoard();
    res.send(boards);
  },
);

boardsRouter.get(
  '/:id',
  async (req: Request<IdParams, {}>, res: Response<Board | string>) => {
    const board = await getOneBoard(req.params.id);

    if (!board) {
      res.status(404).send('Board not found ');
      return;
    }

    res.send(board);
  },
);

boardsRouter.post(
  '/',
  validateBoardInput,
  async (req: Request<{}, Board, CreateBoardRequest>, res: Response<Board>) => {
    const board: Board = {
      name: req.body.name,
      id: randomUUID(),
    };

    await createBoard(board);

    res.send(board);
  },
);

boardsRouter.put(
  '/:id',
  validateBoardInput,
  async (
    req: Request<IdParams, Board, CreateBoardRequest>,
    res: Response<Board>,
  ) => {
    const board = {
      id: req.params.id,
      name: req.body.name,
    };

    await updateBoard(board);
    res.send(board);
  },
);

boardsRouter.delete(
  '/:id',
  async (req: Request<IdParams>, res: Response<void>) => {
    await deleteBoard(req.params.id);
    res.sendStatus(204);
  },
);
