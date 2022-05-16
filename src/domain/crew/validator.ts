import Joi, { ValidationError as InputError } from 'joi';
import { ValidationError } from '../../utils/errorHandler';
import { anyObject } from '../../@types';

export const handleValidationError = (error: InputError) => {
	const { details } = error;
	const errorMessage = details[0].message;
	throw new ValidationError(errorMessage);
};

export const validateCrewInput = (data: anyObject) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(24).required(),
		ship: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
			.required()
	});

	return schema.validate(data);
};
