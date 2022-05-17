import BaseRepo from '../packages/db/baseRepo';
import { IMothership, MothershipModel } from './model';

class MothershipRepo extends BaseRepo<IMothership> {
	constructor() {
		super(MothershipModel);
	}
}

export default new MothershipRepo();
