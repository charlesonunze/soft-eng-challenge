import { expect } from 'chai';
import { generateObjectID, generateRandomName } from '../../src/utils/faker';
import { handleValidationError, validateCrewInput } from '../../src/validators';

describe('VALIDATOR FUNCTIONS', () => {
	afterEach((done) => {
		done();
	});

	describe('handleValidationError', () => {
		it('should handle validation errors', () => {
			const invalidData = {};

			const { error } = validateCrewInput(invalidData);

			expect(() => handleValidationError(error!)).to.throw(
				'"name" is required'
			);
		});
	});

	describe('validateCrewInput', () => {
		it('should validate crew input', () => {
			const invalidData = {};
			const validData = {
				name: generateRandomName(),
				ship: generateObjectID()
			};

			const passed = validateCrewInput(validData);
			const failed = validateCrewInput(invalidData);

			expect(passed.error).to.equal(undefined);
			expect(failed.error!.message).to.equal(`"name" is required`);
		});
	});
});
