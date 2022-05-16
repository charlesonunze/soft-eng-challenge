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
		},
		SwitchCrewBody: {
			properties: {
				crew_member: {
					type: 'string'
				},
				from_ship: {
					type: 'string'
				},
				to_ship: {
					type: 'string'
				}
			}
		}
	}
};
