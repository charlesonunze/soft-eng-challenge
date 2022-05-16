import { Document, Schema, model, Types } from 'mongoose';

interface CrewMember {
	name: string;
	ship: string;
	createdAt?: Date;
}

interface ICrewMember extends Document {
	name: string;
	ship: string;
	createdAt?: Date;
}

const schema = new Schema(
	{
		name: { type: String, trim: true },
		ship: { type: Types.ObjectId }
	},
	{ timestamps: true }
);

schema.index({ name: 1 });

const CrewMemberModel = model<ICrewMember>('CrewMember', schema);

export { CrewMemberModel, CrewMember, ICrewMember };
