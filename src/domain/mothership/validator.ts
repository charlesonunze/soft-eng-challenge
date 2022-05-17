import Joi from 'joi';
import { anyObject } from '../../@types';

export const validateMothershipInput = (data: anyObject) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(24).required()
	});

	return schema.validate(data);
};

export const validateAddShipInput = (data: anyObject) => {
	const schema = Joi.object({
		mothership: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
			.required(),
		num_of_ships: Joi.number().min(1).required()
	});

	return schema.validate(data);
};

export const validateRemoveShipInput = (data: anyObject) => {
	const schema = Joi.object({
		mothership: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
			.required(),
		ship: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
			.required()
	});

	return schema.validate(data);
};
