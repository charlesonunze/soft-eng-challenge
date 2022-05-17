import { ValidationError as InputError } from 'joi';
import { ValidationError } from '../../../utils/errorHandler';

export const handleValidationError = (error: InputError) => {
	const { details } = error;
	const errorMessage = details[0].message;
	throw new ValidationError(errorMessage);
};
