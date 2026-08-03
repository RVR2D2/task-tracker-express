import { Card } from '../types/cards';
import { sqliteAll, sqliteGet, sqliteRun } from './db-connection';

//Create
export const createCard = async (card: Card): Promise<void> => {
  await sqliteRun(
    `
      INSERT INTO cards (id, text)
      VALUES (?,?)
    `,
    [card.id, card.text],
  );
};

//Update
export const updateCard = async (card: Card): Promise<void> => {
  await sqliteRun(
    `
     UPDATE cards SET text = ? 
     WHERE id = ?
    `,
    [card.text, card.id],
  );
};

//Delete
export const deleteCard = async (id: string): Promise<void> => {
  await sqliteRun(
    `
     DELETE FROM cards 
     WHERE id = ?
    `,
    [id],
  );
};

//GetOne
export const getOneCard = async (id: string): Promise<Card | null> => {
  const data = await sqliteGet(
    `
      SELECT * FROM cards
      where id = ?
    `,
    [id],
  );

  if (isCard(data)) {
    return data;
  }

  return null;
};

//GetMany
export const getManyCard = async (): Promise<Card[]> => {
  const data = await sqliteAll(
    `
      SELECT * FROM cards
    `,
  );

  if (!Array.isArray(data)) {
    console.error(`Unknown data format on getMany: ${data}`);
    throw new Error('Unknown data format on getMany');
  }

  return data
    .map((one) => {
      if (isCard(one)) {
        return one;
      }

      return undefined;
    })
    .filter((one) => one !== undefined);
};

const isCard = (data: unknown): data is Card => {
  const card = data as Card;
  return Boolean(card && typeof card === 'object' && card.id && card.text);
};
