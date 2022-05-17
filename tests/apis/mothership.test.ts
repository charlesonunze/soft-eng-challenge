import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app';
import { baseURL } from './constants';
import mothershipService from '../../src/domain/mothership/service';
import shipService from '../../src/domain/ship/service';

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

	describe('POST /api/v1/mothership/ships - add a ship to a mothership', () => {
		it('should fail if a mothership with the provided id does not exist', async () => {
			const res = await request(app).post(`${baseURL}/mothership/ships`).send({
				mothership: '62837b82acdf7ec7c812449f',
				num_of_ships: 2
			});

			expect(res.status).to.equal(404);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.equal('Mothership not found');
		});

		it('should fail if a mothership is full', async () => {
			const mothership = await mothershipService.addMothership({
				name: 'Black pearl'
			});
			const res = await request(app).post(`${baseURL}/mothership/ships`).send({
				mothership: mothership?._id,
				num_of_ships: 10
			});

			expect(res.status).to.equal(400);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.equal('Mothership is full');
		});

		it('should add ships to mothership', async () => {
			const mothership = await mothershipService.addMothership({
				name: 'Black pearl'
			});
			const args = {
				mothership: mothership?._id,
				num_of_ships: 1
			};
			const res = await request(app)
				.post(`${baseURL}/mothership/ships`)
				.send(args);

			expect(res.status).to.equal(200);
			expect(res.body.success).to.equal(true);
			expect(res.body.message).to.equal(
				`${args.num_of_ships} ships added to the ${mothership?.name}`
			);
			expect(res.body.data.mothership.ships.length).to.equal(
				res.body.data.mothership.shipCount
			);
		});
	});

	describe('DELETE /api/v1/mothership/ships - remove a ship to a mothership', () => {
		it('should fail if a mothership with the provided id does not exist', async () => {
			const res = await request(app)
				.delete(`${baseURL}/mothership/ships`)
				.send({
					mothership: '62837b82acdf7ec7c812449f',
					ship: '62837b82acdf7ec7c812449f'
				});

			expect(res.status).to.equal(404);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.equal('Mothership not found');
		});

		it('should fail if a ship  with the provided id is not in the mothership', async () => {
			const mothership = await mothershipService.addMothership({
				name: 'Black pearl'
			});
			const res = await request(app)
				.delete(`${baseURL}/mothership/ships`)
				.send({
					mothership: mothership?._id,
					ship: '62837b82acdf7ec7c812449f'
				});

			expect(res.status).to.equal(404);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.equal('Ship is not on this Mothership');
		});

		it('should remove ship from mothership', async () => {
			const mothership = await mothershipService.addMothership({
				name: 'Black pearl'
			});
			const ship = await shipService.createShip({
				name: 'Black pearl',
				mothership: mothership?._id
			});

			await mothershipService.addShip(mothership?._id, ship?._id);

			const res = await request(app)
				.delete(`${baseURL}/mothership/ships`)
				.send({
					mothership: mothership?._id,
					ship: ship?._id
				});

			expect(res.status).to.equal(200);
			expect(res.body.success).to.equal(true);
			expect(res.body.message).to.equal(
				`One ship removed from the ${mothership?.name}`
			);
		});
	});
});
