run:
	docker compose up -d

build-local-image:
	docker build --platform=linux/386 -t local/cs16-web-server .

rebuild-local-image:
	docker build --no-cache --platform=linux/386 -t local/cs16-web-server .
