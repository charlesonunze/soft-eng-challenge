import { Router } from 'express';
import handler from './handler';
import catchAsyncErrors from '../packages/middleware/catch-async-errors';

const router = Router();

router.post('/mothership', catchAsyncErrors(handler.handleAddMothership));
router.post('/mothership/ships', catchAsyncErrors(handler.handleAddShip));
router.delete('/mothership/ships', catchAsyncErrors(handler.handleRemoveShip));

export { router as mothershipRoutes };
