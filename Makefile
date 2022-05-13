dev:
	npm run build && npm run dev

watch:
	npm run watch

run:
	docker-compose build --no-cache && docker-compose --env-file ./.env.dev up

test:
	npm run test

.PHONY: dev watch run test