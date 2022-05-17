import express from 'express';
import './startup/config';
import { loadMiddleware } from './startup/middleware';
import { loadRoutes } from './startup/routes';
import { connectDB } from './startup/db';
import { NotFoundErrorHandler, ServerErrorHandler } from './utils/errorHandler';
import { logger } from './utils/main.logger';

const app = express();

loadMiddleware(app);
loadRoutes(app);
connectDB();

// Handle Errors
app.use(NotFoundErrorHandler);
app.use(ServerErrorHandler);

const { PORT } = process.env;

export default app.listen(PORT!, () => {
	logger.info(`Speak Lord! 👐, your server is listening on port: ${PORT}`);
});
