import 'reflect-metadata';
import { ALLOWED_ORIGINS, NODE_ENV, PORT } from '#config/environment';
import express, { json, urlencoded } from 'express';
import { basename } from 'node:path';
import { cors } from '#middlewares/cors';
import { fileURLToPath } from 'node:url';
import { errorHandler } from '#middlewares/errorHandler';
import { errorPath } from '#middlewares/errorPath';
import { establishConnection } from '#config/database';
import helmet from 'helmet';
import { limiter } from '#middlewares/limit';
import { logger } from '#utils/logger';
import parser from 'cookie-parser';
import { router } from '#routes/index';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(helmet());
app.use(parser());
app.use(cors({ skip: NODE_ENV === 'development', origins: ALLOWED_ORIGINS }));
app.use(limiter(NODE_ENV === 'development'));

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    date: new Date(),
  });
});

app.use('/api/v1', router);
app.use(errorPath);
app.use(errorHandler);

if (
  basename(fileURLToPath(import.meta.url)) === basename(process.argv[1]) &&
  NODE_ENV !== 'test'
) {
  await establishConnection();
  app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
}

export { app };
