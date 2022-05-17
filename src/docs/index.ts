import { components } from './components';
import { addCrewDocs, switchCrewDocs } from '../domain/crew/docs';
import { addMothershipDocs } from '../domain/mothership/docs';

const swaggerDocs = {
	openapi: '3.0.0',
	info: {
		version: '1.0.0',
		title: 'Pirates of the Caribbean'
	},
	schemes: [],
	servers: [
		{
			url: '/api/v1',
			description: 'Development Server'
		}
	],

	paths: {
		'/crew': addCrewDocs,
		'/crew/switch': switchCrewDocs,

		'/mothership': addMothershipDocs
	},

	components: components
};

export { swaggerDocs };
