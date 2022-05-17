import { Application } from 'express';
import { swaggerRoute } from '../docs/route';
import { crewRoutes } from '../domain/crew/route';
import { mothershipRoutes } from '../domain/mothership/route';

export const loadRoutes = (app: Application) => {
	// Root Route
	app.get('/', (req, res) => {
		res.send('Hi there!');
	});

	// API Routes
	app.use('/api/v1', crewRoutes);
	app.use('/api/v1', mothershipRoutes);

	// Swagger Docs
	app.use('/api/docs', swaggerRoute);
};
