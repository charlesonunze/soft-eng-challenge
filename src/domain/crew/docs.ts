export const crewDocs = {
	post: {
		tags: ['CREW MEMBERS'],
		summary: 'Add a new crew member.',

		requestBody: {
			required: true,
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/CrewBody'
					},
					example: {
						name: 'Will Turner',
						ship: '5ed4ae0a03155a6392e1632a'
					}
				}
			}
		},

		responses: {
			'200': {
				description: 'Success response',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Success'
						},
						example: {
							success: true,
							message: 'New crew member added to the Black Pearl',
							data: {
								crewMember: [
									{
										name: 'Will Turner',
										ship: '5ed4ae0a03155a6392e1632a'
									}
								]
							}
						}
					}
				}
			},

			'400': {
				description: 'An error object',
				content: {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Error'
						},
						example: {
							success: false,
							message: 'Something bad happened.'
						}
					}
				}
			}
		}
	}
};
