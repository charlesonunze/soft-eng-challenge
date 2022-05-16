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
		//  clean up db
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
				await shipService.addCrewMember(shipID, crewMember._id);
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
				`New crew member added to the ${ship?.name}`
			);
			expect(res.body.data.crew_member.name).to.equal(data.name);
			expect(res.body.data.crew_member.ship).to.equal(data.ship);
			expect(updatedShip?.crew.length).to.equal(1);
		});
	});

	describe('POST /api/v1/crew/switch - switch a crew member between ships', () => {
		it('should fail if crew_member is not of type ObjectId', async () => {
			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				crew_member: 'NOT AN OBJECT ID',
				from_ship: generateObjectID(),
				to_ship: generateObjectID()
			});

			expect(res.status).to.equal(422);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('valid mongo id');
		});

		it('should fail if from_ship is not of type ObjectId', async () => {
			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				from_ship: 'NOT AN OBJECT ID',
				crew_member: generateObjectID(),
				to_ship: generateObjectID()
			});

			expect(res.status).to.equal(422);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('valid mongo id');
		});

		it('should fail if to_ship is not of type ObjectId', async () => {
			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				to_ship: 'NOT AN OBJECT ID',
				crew_member: generateObjectID(),
				from_ship: generateObjectID()
			});

			expect(res.status).to.equal(422);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('valid mongo id');
		});

		it('should fail if crew_member with the provided id is not found', async () => {
			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				crew_member: generateObjectID(),
				from_ship: generateObjectID(),
				to_ship: generateObjectID()
			});

			expect(res.status).to.equal(404);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('Crew member not found');
		});

		it('should fail if from_ship with the provided id is not found', async () => {
			const ship = await shipService.createShip({ name: 'Black Pearl' });
			const shipID = ship?._id;

			const crewMember = await crewService.addCrewMember({
				name: generateRandomName(),
				ship: shipID
			});

			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				crew_member: crewMember._id,
				from_ship: generateObjectID(),
				to_ship: generateObjectID()
			});

			expect(res.status).to.equal(404);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('Ship not found');
		});

		it('should fail if to_ship with the provided id is not found', async () => {
			const ship = await shipService.createShip({ name: 'Black Pearl' });
			const shipID = ship?._id;

			const crewMember = await crewService.addCrewMember({
				name: generateRandomName(),
				ship: shipID
			});

			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				crew_member: crewMember._id,
				from_ship: shipID,
				to_ship: generateObjectID()
			});

			expect(res.status).to.equal(404);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('Ship not found');
		});

		it('should fail if crew_member is not in from_ship', async () => {
			const ship = await shipService.createShip({ name: 'Black Pearl' });
			const shipID = ship?._id;
			const from_ship = await shipService.createShip({ name: 'Interceptor' });
			const to_ship = await shipService.createShip({ name: 'Flying Dutchman' });

			const crewMember = await crewService.addCrewMember({
				name: generateRandomName(),
				ship: shipID
			});

			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				crew_member: crewMember._id,
				from_ship: from_ship?._id,
				to_ship: to_ship?._id
			});

			expect(res.status).to.equal(400);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('Crew member is not on this ship');
		});

		it('should fail if to_ship is full', async () => {
			const from_ship = await shipService.createShip({ name: 'Black Pearl' });
			const from_shipID = from_ship?._id;
			const to_ship = await shipService.createShip({ name: 'Dauntless' });
			const to_shipID = to_ship?._id;

			const count = parseInt(SHIP_CAPACITY!);
			// fill up ship
			for (let i = 0; i < count; i++) {
				const crewMember = await crewService.addCrewMember({
					name: generateRandomName(),
					ship: to_shipID
				});
				await shipService.addCrewMember(to_shipID, crewMember._id);
			}

			const crewMember = await crewService.addCrewMember({
				name: generateRandomName(),
				ship: from_shipID
			});
			await shipService.addCrewMember(from_shipID, crewMember._id);

			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				crew_member: crewMember._id,
				from_ship: from_shipID,
				to_ship: to_shipID
			});

			expect(res.status).to.equal(400);
			expect(res.body.success).to.equal(false);
			expect(res.body.message).to.include('Destination ship is full');
		});

		it('should switch crew_member', async () => {
			const from_ship = await shipService.createShip({ name: 'Black Pearl' });
			const from_shipID = from_ship?._id;
			const to_ship = await shipService.createShip({ name: 'Dauntless' });
			const to_shipID = to_ship?._id;

			const crewMember = await crewService.addCrewMember({
				name: generateRandomName(),
				ship: from_shipID
			});
			await shipService.addCrewMember(from_shipID, crewMember._id);

			const res = await request(app).post(`${baseURL}/crew/switch`).send({
				crew_member: crewMember._id,
				from_ship: from_shipID,
				to_ship: to_shipID
			});

			const updatedFromShip = await shipService.getShip(from_shipID);
			const updatedToShip = await shipService.getShip(to_shipID);

			expect(res.status).to.equal(200);
			expect(res.body.success).to.equal(true);
			expect(updatedFromShip?.crew.length).to.equal(0);
			expect(updatedToShip?.crew.length).to.equal(1);
			expect(res.body.message).to.include(
				`Crew member has been moved to the ${to_ship?.name} from the ${from_ship?.name}`
			);
		});
	});
});
