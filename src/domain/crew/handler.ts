import { RequestHandler } from 'express';
import { NotFoundError, UserError } from '../../utils/errorHandler';
import crewService from './service';
import shipService from '../ship/service';
import { sendResponse } from '../../utils/response';
import { Types } from 'mongoose';
import { handleValidationError } from '../packages/validators';
import { validateCrewInput, validateSwitchCrewInput } from './validator';

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
		await shipService.addCrewMember(ship._id, crewMember._id);

		return sendResponse({
			res,
			statusCode: 201,
			message: `New crew member added to the ${ship.name}`,
			data: { crew_member: crewMember }
		});
	};

	handleSwitchCrewMember: RequestHandler = async (req, res) => {
		const { error, value } = validateSwitchCrewInput(req.body);
		if (error) return handleValidationError(error);

		const crew_member = await crewService.getCrewMember(value.crew_member);
		if (!crew_member) throw new NotFoundError('Crew member not found');

		const from_ship = await shipService.getShip(value.from_ship);
		if (!from_ship) throw new NotFoundError('Ship not found');

		const to_ship = await shipService.getShip(value.to_ship);
		if (!to_ship) throw new NotFoundError('Ship not found');

		const doc = await shipService.findCrewMember(
			from_ship._id,
			Types.ObjectId(value.crew_member)
		);
		if (!doc) throw new NotFoundError('Crew member is not on this ship');

		const capacity = parseInt(SHIP_CAPACITY!);
		if (to_ship.crewCount === capacity)
			throw new UserError('Destination ship is full');

		await shipService.removeCrewMember(from_ship._id, crew_member._id);
		await shipService.addCrewMember(to_ship._id, crew_member._id);
		await crewService.editCrewMember(crew_member._id, { ship: to_ship._id });

		return sendResponse({
			res,
			message: `Crew member has been moved to the ${to_ship.name} from the ${from_ship.name}`
		});
	};
}

export default new CrewHandler();
