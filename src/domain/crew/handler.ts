import { RequestHandler } from 'express';
import { handleValidationError, validateCrewInput } from './validator';
import { NotFoundError, UserError } from '../../utils/errorHandler';
import crewService from './service';
import shipService from '../ship/service';
import { sendResponse } from '../../utils/response';

const { SHIP_CAPACITY } = process.env;

class CrewHandler {
	handleAddCrewMember: RequestHandler = async (req, res) => {
		const { error, value } = validateCrewInput(req.body);
		if (error) return handleValidationError(error);

		const ship = await shipService.getShip(value.ship);
		if (!ship) throw new NotFoundError('Ship not found');

		const capacity = parseInt(SHIP_CAPACITY!);
		if (ship.crewCount === capacity) throw new UserError('Ship is full');

		const crewMember = await crewService.addCrewMember(value);
		await shipService.addCrew(ship._id, crewMember._id);

		return sendResponse({
			res,
			statusCode: 201,
			message: `New crew member added to the ${ship.name}`,
			data: { crewMember }
		});
	};
}

export default new CrewHandler();
