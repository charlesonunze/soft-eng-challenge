import { Document, Schema, model, Types } from 'mongoose';

interface Ship {
	name?: string;
	crew?: Types.ObjectId[];
	crewCount?: number;
	mothership?: string;
	createdAt?: Date;
}

interface IShip extends Document {
	name: string;
	crew: Types.ObjectId[];
	crewCount: number;
	mothership: string;
	createdAt?: Date;
}

const schema = new Schema(
	{
		name: { type: String, trim: true },
		crew: [{ type: Types.ObjectId, ref: 'CrewMember' }],
		crewCount: { type: Number, default: 0 },
		mothership: { type: Types.ObjectId, ref: 'Mothership' }
	},
	{ timestamps: true }
);

schema.index({ name: 1 });

const ShipModel = model<IShip>('Ship', schema);

export { ShipModel, Ship, IShip };
