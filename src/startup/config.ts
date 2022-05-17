import path from 'path';
import dotenv from 'dotenv';

switch (process.env.NODE_ENV) {
	case 'development':
		dotenv.config({ path: path.join(__dirname, '../../.env.dev') });
		break;

	case 'test':
		dotenv.config({ path: path.join(__dirname, '../../.env.test') });
		break;
}
