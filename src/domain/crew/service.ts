import CrewRepo from './repo';
import { CrewMember, ICrewMember } from './model';

class CrewService {
	private crewRepo: CrewRepo;

	constructor() {
		this.crewRepo = new CrewRepo();
	}

	async addCrewMember(data: CrewMember) {
		return await this.crewRepo.insertOne(data as ICrewMember);
	}

	async getCrewMember(id: string) {
		return this.crewRepo.findOne({ _id: id });
	}

	async editCrewMember(id: string, data: CrewMember) {
		return await this.crewRepo.findOneAndUpdate(
			{ _id: id },
			{ $set: data },
			{ new: true }
		);
	}

	async deleteCrewMember(id: string) {
		return await this.crewRepo.deleteOne({ _id: id });
	}
}

export default new CrewService();
