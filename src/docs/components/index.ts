export const components = {
	schemas: {
		Success: {
			properties: {
				success: {
					type: 'boolean'
				},
				message: {
					type: 'string'
				},
				data: {
					type: 'object'
				}
			}
		},
		Error: {
			properties: {
				success: {
					type: 'boolean'
				},
				message: {
					type: 'string'
				}
			}
		},

		CrewBody: {
			properties: {
				name: {
					type: 'string'
				},
				ship: {
					type: 'string'
				}
			}
		}
	}
};
