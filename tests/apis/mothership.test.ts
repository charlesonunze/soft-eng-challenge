import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app';
import { baseURL } from './constants';
import mothershipService from '../../src/domain/mothership/service';

describe('MOTHERSHIP API', () => {
	afterEach((done) => {
		app.close();
		done();
	});

	after(async () => {
		// clean up db
		const collections = await mongoose.connection.db.collections();
		for (const c of collections) {
			await c.deleteMany({});
		}
	});

	describe('POST /api/v1/mothership - create a mothership', () => {
		it('should fail if a mothership with the provided name already exists', async () => {
			const res = await request(app).post(`${baseURL}/mothership`).send({});

			expect(res.status).to.equal(422);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('"name" is required');
		});

		it('should fail if a mothership with the provided name already exists', async () => {
			await mothershipService.addMothership({ name: 'Black pearl' });
			const res = await request(app)
				.post(`${baseURL}/mothership`)
				.send({ name: 'Black pearl' });

			expect(res.status).to.equal(400);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include(
				'A ship with that name already exists'
			);
		});

		it('add a mothership with 3 ships with 3 crew members each', async () => {
			const res = await request(app)
				.post(`${baseURL}/mothership`)
				.send({ name: 'Flying Dutchman' });

			expect(res.status).to.equal(201);
			expect(res.body.success).to.equal(true);
			expect(res.body.message).to.include('New mothership added');
			expect(res.body.data.mothership.ships.length).to.equal(
				res.body.data.mothership.shipCount
			);
		});
	});
});
