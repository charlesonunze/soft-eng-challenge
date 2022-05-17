import { expect } from 'chai';
import { validateCrewInput } from '../../src/domain/crew/validator';
import { handleValidationError } from '../../src/domain/packages/validators';
import { generateObjectID, generateRandomName } from '../../src/utils/faker';

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
