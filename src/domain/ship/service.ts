import { Types } from 'mongoose';
import shipRepo from './repo';
import { IShip, Ship } from './model';
import crewService from '../crew/service';
import { CrewMember } from '../crew/model';
import { generateRandomName } from '../../utils/faker';

const { STARTING_CREW_NUMBER } = process.env;

class ShipService {
	async createShip(data: Ship) {
		const ship = await shipRepo.insertOne(data as IShip);

		const startingCrewNumber = parseInt(STARTING_CREW_NUMBER!);
		const crewCount = startingCrewNumber;
		const crew = [];

		for (let i = 0; i < startingCrewNumber; i++) {
			const c = await crewService.addCrewMember({
				name: generateRandomName(),
				ship: ship.id
			});
			crew.push(c._id);
		}

		const updatedShip = await shipRepo.findOneAndUpdate(
			{ _id: ship._id },
			{
				$set: {
					crewCount,
					crew
				}
			}
		);

		return updatedShip;
	}

	async getShip(id: string) {
		return await shipRepo.findOne({ _id: id });
	}

	async findCrewMember(id: string, crewMember: Types.ObjectId) {
		return await shipRepo.findOne({ _id: id, crew: { $in: [crewMember] } });
	}

	async addCrewMember(id: string, crew: CrewMember) {
		return await shipRepo.findOneAndUpdate(
			{ _id: id },
			{
				$push: {
					crew
				},
				$inc: {
					crewCount: 1
				}
			},
			{ new: true }
		);
	}

	async removeCrewMember(id: string, crew: CrewMember) {
		return await shipRepo.findOneAndUpdate(
			{ _id: id },
			{
				$pull: {
					crew
				},
				$inc: {
					crewCount: -1
				}
			},
			{ new: true }
		);
	}

	async deleteShip(id: string) {
		await crewService.deleteManyCrewMembers(id);
		return await shipRepo.deleteOne({ _id: id });
	}
}

export default new ShipService();
