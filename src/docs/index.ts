import { components } from './components';
import { crewDocs } from '../domain/crew/docs';

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
		'/crew': crewDocs
	},

	components: components
};

export { swaggerDocs };
