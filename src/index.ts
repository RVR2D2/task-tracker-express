import express from 'express';
import basicAuth from 'express-basic-auth';
import { ADMIN_LOGIN, ADMIN_PASSWORD, PORT } from './config';
import { createTables } from './database/create-tables';
import { cardsRouter } from './routers/cards.router';

async function run() {
  await createTables();

  const server = express();

  server.use(express.json());
  server.use(
    basicAuth({
      users: { [ADMIN_LOGIN]: ADMIN_PASSWORD },
      challenge: true,
    }),
  );

  server.get('/', (req, res) => {
    res.send('HELLO');
  });

  server.use('/cards', cardsRouter);

  server.listen(PORT);
}

run().catch((error) => console.error(error));
