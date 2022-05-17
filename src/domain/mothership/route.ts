import { Router } from 'express';
import handler from './handler';
import catchAsyncErrors from '../packages/middleware/catch-async-errors';

const router = Router();

router.post('/mothership', catchAsyncErrors(handler.handleAddMothership));

export { router as mothershipRoutes };
