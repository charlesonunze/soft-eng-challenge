import './config';
import express from 'express';
import { logger } from './utils/main.logger';
import { connectDB } from './startup/db';
import { loadRoutes } from './startup/routes';
import { loadMiddleware } from './startup/middleware';
import { NotFoundErrorHandler, ServerErrorHandler } from './utils/errorHandler';

const app = express();

// Load Middleware
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
