import { Document, Schema, model, Types } from 'mongoose';
import { CrewMember } from '../crew/model';

interface Ship {
	name: string;
	crew?: Types.ObjectId[];
	crewCount?: number;
	createdAt?: Date;
}

interface IShip extends Document {
	name: string;
	crew: Types.ObjectId[];
	crewCount: number;
	createdAt?: Date;
}

const schema = new Schema(
	{
		name: { type: String, trim: true },
		crew: [{ type: Types.ObjectId }],
		crewCount: { type: Number, default: 0 }
	},
	{ timestamps: true }
);

schema.index({ name: 1 });

const ShipModel = model<IShip>('Ship', schema);

export { ShipModel, Ship, IShip };
