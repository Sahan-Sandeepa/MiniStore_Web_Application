# Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only the csproj files first (to leverage caching)
COPY MiniStore.API/MiniStore.API.csproj MiniStore.API/
COPY MiniStore.Core/MiniStore.Core.csproj MiniStore.Core/
COPY MiniStore.Infrastructure/MiniStore.Infrastructure.csproj MiniStore.Infrastructure/

# Restore dependencies (faster if csproj files don't change)
RUN dotnet restore MiniStore.API/MiniStore.API.csproj

# Copy everything else
COPY . .

# Publish
RUN dotnet publish MiniStore.API/MiniStore.API.csproj -c Release -o /app/publish --no-restore

# Final image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MiniStore.API.dll"]
