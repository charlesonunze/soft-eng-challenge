import Joi from 'joi';
import { anyObject } from '../../@types';

export const validateCrewInput = (data: anyObject) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(24).required(),
		ship: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
			.required()
	});

	return schema.validate(data);
};

export const validateSwitchCrewInput = (data: anyObject) => {
	const schema = Joi.object({
		crew_member: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
			.required(),
		from_ship: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
			.required(),
		to_ship: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
			.required()
	});

	return schema.validate(data);
};
