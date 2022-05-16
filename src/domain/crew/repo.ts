import BaseRepo from '../packages/db/baseRepo';
import { ICrewMember, CrewMemberModel } from './model';

class CrewMemberRepo extends BaseRepo<ICrewMember> {
	constructor() {
		super(CrewMemberModel);
	}
}

export default CrewMemberRepo;
