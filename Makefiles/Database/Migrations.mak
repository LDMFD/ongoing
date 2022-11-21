db-add-migration:
	cd Entities && \
		dotnet ef migrations add "${NAME}"

db-update:
	cd Entities && \
		dotnet ef database update

db-update-cached:
	cd Entities && \
		dotnet ef database update --no-build
