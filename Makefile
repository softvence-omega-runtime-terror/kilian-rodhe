build:
	docker compose --profile prod build
push:
	docker compose --profile prod push

deploy: build push

docker-run:
	docker compose --profile prod up -d

action:
	docker compose --profile prod down --remove-orphans
	docker compose --profile prod rm -f
	docker compose --profile prod pull
	docker compose --profile prod up -d
	docker system prune -af
	sudo systemctl restart caddy

deploy-app:
	make deploy
	chmod 400 ./tundra.pem
	ssh -i ./tundra.pem ubuntu@23.20.201.40
	cd ~/backlystapp-frontend
	make action
