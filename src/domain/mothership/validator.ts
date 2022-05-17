import Joi from 'joi';
import { anyObject } from '../../@types';

export const validateMothershipInput = (data: anyObject) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(24).required()
	});

	return schema.validate(data);
};
