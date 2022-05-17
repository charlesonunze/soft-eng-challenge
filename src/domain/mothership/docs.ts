export const addMothershipDocs = {
	post: {
		tags: ['MOTHERSHIP'],
		summary: 'Add a mothership.',

		requestBody: {
			required: true,
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/AddMothershipBody'
					},
					example: {
						name: 'Black pearl'
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
							message: 'New mothership added',
							data: {
								mothership: {
									name: 'Flying Dutchman',
									shipCount: 3,
									ships: [
										{
											crew: [
												'62837b4586552fc6e82c8686',
												'62837b4586552fc6e82c8688',
												'62837b4586552fc6e82c868a'
											],
											crewCount: 3,
											name: 'Cracked',
											mothership: '62837b4586552fc6e82c8679'
										}
									]
								}
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

export const manageShipDocs = {
	post: {
		tags: ['MOTHERSHIP'],
		summary: 'Add a ship.',

		requestBody: {
			required: true,
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/AddShipBody'
					},
					example: {
						mothership: '62837b4586552fc6e82c8679',
						num_of_ships: 2
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
							message: 'New mothership added',
							data: {
								mothership: {
									name: 'Flying Dutchman',
									shipCount: 3,
									ships: [
										{
											crew: [
												'62837b4586552fc6e82c8686',
												'62837b4586552fc6e82c8688',
												'62837b4586552fc6e82c868a'
											],
											crewCount: 3,
											name: 'Cracked',
											mothership: '62837b4586552fc6e82c8679'
										}
									]
								}
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
	},
	delete: {
		tags: ['MOTHERSHIP'],
		summary: 'Remove a ship.',

		requestBody: {
			required: true,
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/RemoveShipBody'
					},
					example: {
						mothership: '62837b4586552fc6e82c8679',
						ship: '62837b4586552fc6e82c8679'
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
							message: 'New mothership added',
							data: {
								mothership: {
									name: 'Flying Dutchman',
									shipCount: 3,
									ships: [
										{
											crew: [
												'62837b4586552fc6e82c8686',
												'62837b4586552fc6e82c8688',
												'62837b4586552fc6e82c868a'
											],
											crewCount: 3,
											name: 'Cracked',
											mothership: '62837b4586552fc6e82c8679'
										}
									]
								}
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
