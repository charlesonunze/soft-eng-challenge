import mothershipRepo from './repo';
import shipService from '../ship/service';
import { Mothership, IMothership } from './model';
import { generateRandomName } from '../../utils/faker';

const { STARTING_SHIP_NUMBER } = process.env;

class MothershipService {
	async addMothership(data: Mothership) {
		const mothership = await mothershipRepo.insertOne(data as IMothership);

		const startingShipNumber = parseInt(STARTING_SHIP_NUMBER!);
		const shipCount = startingShipNumber;
		const ships = [];

		for (let i = 0; i < startingShipNumber; i++) {
			const s = await shipService.createShip({
				name: generateRandomName(),
				mothership: mothership._id
			});
			ships.push(s?._id);
		}

		const updatedShip = await mothershipRepo.findOneAndUpdate(
			{ _id: mothership._id },
			{
				$set: {
					shipCount,
					ships
				}
			}
		);

		return updatedShip;
	}

	async getMothership(id: string) {
		const mothership = await mothershipRepo.find(
			{ _id: id },
			{
				populate: {
					path: 'ships'
				}
			}
		);

		return mothership[0];
	}

	async getMothershipByName(name: string) {
		return await mothershipRepo.findOne({ name });
	}

	async editMothership(id: string, data: Mothership) {
		return await mothershipRepo.findOneAndUpdate(
			{ _id: id },
			{ $set: data },
			{ new: true }
		);
	}

	async deleteMothership(id: string) {
		return await mothershipRepo.deleteOne({ _id: id });
	}
}

export default new MothershipService();
