rebuild:
	docker compose up --build --no-deps --force-recreate -d

build-local:
	docker compose -f docker-compose.local.yml up -d