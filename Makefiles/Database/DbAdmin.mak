db-clean:
	docker-compose stop postgres
	docker-compose rm -f postgres
	docker volume rm -f ongoing_postgres

db-reset:
	cd Entities && \
		dotnet ef database drop -f && \
		rm -rf Migrations/ && \
		dotnet ef migrations add "Initial migration" && \
		dotnet ef database update

db-update:
	cd Entities && \
		dotnet ef database update
	make spicedb-init

db-update-cached:
	cd Entities && \
		dotnet ef database update --no-build
	make spicedb-init
