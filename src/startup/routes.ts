import { Application } from 'express';
import { crewRoutes } from '../domain/crew/route';
import { swaggerRoute } from '../docs/route';

export const loadRoutes = (app: Application) => {
	// Root Route
	app.get('/', (req, res) => {
		res.send('Hi there!');
	});

	// API Routes
	app.use('/api/v1', crewRoutes);

	// Swagger Docs
	app.use('/api/docs', swaggerRoute);
};
