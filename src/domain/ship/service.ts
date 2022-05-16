import ShipRepo from './repo';
import { IShip, Ship } from './model';
import CrewRepo from '../crew/repo';
import { CrewMember, ICrewMember } from '../crew/model';
import { generateRandomName } from '../../utils/faker';
import { Types } from 'mongoose';

const { STARTING_CREW_NUMBER } = process.env;

class ShipService {
	private shipRepo: ShipRepo;
	private crewRepo: CrewRepo;

	constructor() {
		this.shipRepo = new ShipRepo();
		this.crewRepo = new CrewRepo();
	}

	async createShip(data: Ship) {
		const ship = await this.shipRepo.insertOne(data as IShip);

		// const startingCrewNumber = parseInt(STARTING_CREW_NUMBER!);
		// const crewCount = startingCrewNumber;
		// let crew = [];

		// for (let i = 0; i < startingCrewNumber; i++) {
		// 	crew.push({ name: generateRandomName(), ship: ship.id });
		// }

		// crew = await this.crewRepo.insertMany(crew as ICrewMember[]);

		// const updatedShip = await this.shipRepo.findOneAndUpdate(
		// 	{ _id: ship._id },
		// 	{
		// 		$set: {
		// 			crewCount,
		// 			crew: crew.map((c) => c.id)
		// 		}
		// 	}
		// );

		return ship;
	}

	async getShip(id: string) {
		return this.shipRepo.findOne({ _id: id });
	}

	async findCrewMember(id: string, crewMember: Types.ObjectId) {
		return this.shipRepo.findOne({ _id: id, crew: { $in: [crewMember] } });
	}

	async addCrewMember(id: string, crew: CrewMember) {
		return await this.shipRepo.findOneAndUpdate(
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
		return await this.shipRepo.findOneAndUpdate(
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
		return await this.shipRepo.deleteOne({ _id: id });
	}
}

export default new ShipService();
