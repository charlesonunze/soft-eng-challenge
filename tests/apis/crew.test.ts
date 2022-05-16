import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app';
import { baseURL } from './constants';
import shipService from '../../src/domain/ship/service';
import crewService from '../../src/domain/crew/service';
import { generateObjectID, generateRandomName } from '../../src/utils/faker';

const { SHIP_CAPACITY } = process.env;

describe('CREW API', () => {
	afterEach((done) => {
		app.close();
		done();
	});

	after(async () => {
		const collections = await mongoose.connection.db.collections();

		for (const c of collections) {
			await c.deleteMany({});
		}
	});

	describe('POST /api/v1/crew - add a crew member to ship', () => {
		it('should fail if ship id is not of type ObjectId', async () => {
			const res = await request(app).post(`${baseURL}/crew`).send({
				name: generateRandomName(),
				ship: 'NOT AN OBJECT ID'
			});

			expect(res.status).to.equal(422);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('valid mongo id');
		});

		it('should fail if ship with the provided id is not found', async () => {
			const res = await request(app).post(`${baseURL}/crew`).send({
				name: generateRandomName(),
				ship: generateObjectID()
			});

			expect(res.status).to.equal(404);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('Ship not found');
		});

		it('should fail if the ship is full', async () => {
			const ship = await shipService.createShip({ name: 'Black Pearl' });
			const shipID = ship?._id;

			const count = parseInt(SHIP_CAPACITY!);

			// fill up ship
			for (let i = 0; i < count; i++) {
				const crewMember = await crewService.addCrewMember({
					name: generateRandomName(),
					ship: shipID
				});
				await shipService.addCrew(shipID, crewMember._id);
			}

			const res = await request(app).post(`${baseURL}/crew`).send({
				name: generateRandomName(),
				ship: shipID
			});

			expect(res.status).to.equal(400);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('Ship is full');
		});

		it('should add a new crew member and update the destination ship', async () => {
			const ship = await shipService.createShip({ name: 'Black Pearl' });
			const shipID = ship?._id.toString();

			const data = {
				name: generateRandomName(),
				ship: shipID
			};

			const res = await request(app).post(`${baseURL}/crew`).send(data);
			const updatedShip = await shipService.getShip(shipID);

			expect(res.status).to.equal(201);
			expect(res.body.success).to.equal(true);
			expect(res.body.success).to.equal(true);
			expect(res.body.message).to.equal(
				`New crew member added to the ${ship.name}`
			);
			expect(res.body.data.crewMember.name).to.equal(data.name);
			expect(res.body.data.crewMember.ship).to.equal(data.ship);
			expect(updatedShip?.crew.length).to.equal(1);
		});
	});
});
