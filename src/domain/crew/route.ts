import { Router } from 'express';
import handler from './handler';
import catchAsyncErrors from '../packages/middleware/catch-async-errors';

const router = Router();

router.post('/crew', catchAsyncErrors(handler.handleAddCrewMember));
router.post('/crew/switch', catchAsyncErrors(handler.handleSwitchCrewMember));

export { router as crewRoutes };
