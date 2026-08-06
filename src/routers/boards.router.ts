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
import { BoardIdParams } from '../types/common';
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
  '/:boardId',
  async (req: Request<BoardIdParams, {}>, res: Response<Board | string>) => {
    const board = await getOneBoard(req.params.boardId);

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
  '/:boardId',
  validateBoardInput,
  async (
    req: Request<BoardIdParams, Board, CreateBoardRequest>,
    res: Response<Board>,
  ) => {
    const board = {
      id: req.params.boardId,
      name: req.body.name,
    };

    await updateBoard(board);
    res.send(board);
  },
);

boardsRouter.delete(
  '/:boardId',
  async (req: Request<BoardIdParams>, res: Response<void>) => {
    await deleteBoard(req.params.boardId);
    res.sendStatus(204);
  },
);
