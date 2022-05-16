import BaseRepo from '../packages/db/baseRepo';
import { IShip, ShipModel } from './model';

class ShipRepo extends BaseRepo<IShip> {
	constructor() {
		super(ShipModel);
	}
}

export default new ShipRepo();
