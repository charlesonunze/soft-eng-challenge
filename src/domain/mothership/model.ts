import { Document, Schema, model, Types } from 'mongoose';
import { anyObject } from '../../@types';

interface Mothership {
	name?: string;
	shipCount?: number;
	ships?: anyObject[];
	createdAt?: Date;
}

interface IMothership extends Document {
	name: string;
	shipCount: number;
	ships: anyObject[];
	createdAt?: Date;
}

const schema = new Schema(
	{
		name: { type: String, trim: true },
		ships: [{ type: Types.ObjectId, ref: 'Ship' }],
		shipCount: { type: Number, default: 0 }
	},
	{ timestamps: true }
);

schema.index({ name: 1 });

const MothershipModel = model<IMothership>('Mothership', schema);

export { MothershipModel, Mothership, IMothership };
