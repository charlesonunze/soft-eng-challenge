import { RequestHandler } from 'express';
import { NotFoundError, UserError } from '../../utils/errorHandler';
import mothershipService from './service';
import shipService from '../ship/service';
import { sendResponse } from '../../utils/response';
import { handleValidationError } from '../packages/validators';
import {
	validateAddShipInput,
	validateMothershipInput,
	validateRemoveShipInput
} from './validator';
import { Types } from 'mongoose';
import { generateRandomName } from '../../utils/faker';

const { MOTHERSHIP_CAPACITY } = process.env;

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

	handleAddShip: RequestHandler = async (req, res) => {
		const { error, value } = validateAddShipInput(req.body);
		if (error) return handleValidationError(error);

		let mothership = await mothershipService.getMothership(value.mothership);
		if (!mothership) throw new NotFoundError('Mothership not found');

		const capacity = parseInt(MOTHERSHIP_CAPACITY!);
		const numOfShips = parseInt(value.num_of_ships);
		const sum = mothership.shipCount + numOfShips;
		if (sum >= capacity) throw new UserError('Mothership is full');

		for (let i = 0; i < numOfShips; i++) {
			const ship = await shipService.createShip({
				name: generateRandomName(),
				mothership: mothership._id
			});
			await mothershipService.addShip(mothership._id, ship?._id);
		}

		mothership = await mothershipService.getMothership(mothership._id);

		return sendResponse({
			res,
			data: { mothership },
			message: `${numOfShips} ships added to the ${mothership.name}`
		});
	};

	handleRemoveShip: RequestHandler = async (req, res) => {
		const { error, value } = validateRemoveShipInput(req.body);
		if (error) return handleValidationError(error);

		const mothership = await mothershipService.getMothership(value.mothership);
		if (!mothership) throw new NotFoundError('Mothership not found');

		const shipID = Types.ObjectId(value.ship);
		const doc = await mothershipService.findShip(mothership._id, shipID);
		if (!doc) throw new NotFoundError('Ship is not on this Mothership');

		const updatedMothership = await mothershipService.removeShip(
			mothership._id,
			shipID
		);
		await shipService.deleteShip(value.ship);

		return sendResponse({
			res,
			data: { mothership: updatedMothership },
			message: `One ship removed from the ${updatedMothership?.name}`
		});
	};
}

export default new MothershipHandler();
