import { RequestHandler } from 'express';
import { UserError } from '../../utils/errorHandler';
import mothershipService from '../mothership/service';
import { sendResponse } from '../../utils/response';
import { handleValidationError } from '../packages/validators';
import { validateMothershipInput } from './validator';

class MothershipHandler {
	handleAddMothership: RequestHandler = async (req, res) => {
		const { error, value } = validateMothershipInput(req.body);
		if (error) return handleValidationError(error);

		let mothership = await mothershipService.getMothershipByName(value.name);
		if (mothership) throw new UserError('A ship with that name already exists');

		mothership = await mothershipService.addMothership(value);
		mothership = await mothershipService.getMothership(mothership?._id);

		return sendResponse({
			res,
			statusCode: 201,
			message: `New mothership added`,
			data: { mothership }
		});
	};
}

export default new MothershipHandler();
