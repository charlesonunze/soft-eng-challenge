import crewRepo from './repo';
import { CrewMember, ICrewMember } from './model';

class CrewService {
	async addCrewMember(data: CrewMember) {
		return await crewRepo.insertOne(data as ICrewMember);
	}

	async getCrewMember(id: string) {
		return crewRepo.findOne({ _id: id });
	}

	async editCrewMember(id: string, data: CrewMember) {
		return await crewRepo.findOneAndUpdate(
			{ _id: id },
			{ $set: data },
			{ new: true }
		);
	}

	async deleteCrewMember(id: string) {
		return await crewRepo.deleteOne({ _id: id });
	}
}

export default new CrewService();
