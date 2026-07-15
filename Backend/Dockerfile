# Base stage for running the app
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# SDK stage for building the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy projects and restore
COPY ["src/AssetFlow.API/AssetFlow.API.csproj", "src/AssetFlow.API/"]
COPY ["src/AssetFlow.Infrastructure/AssetFlow.Infrastructure.csproj", "src/AssetFlow.Infrastructure/"]
COPY ["src/AssetFlow.Application/AssetFlow.Application.csproj", "src/AssetFlow.Application/"]
COPY ["src/AssetFlow.Domain/AssetFlow.Domain.csproj", "src/AssetFlow.Domain/"]
COPY ["src/AssetFlow.Shared/AssetFlow.Shared.csproj", "src/AssetFlow.Shared/"]

RUN dotnet restore "src/AssetFlow.API/AssetFlow.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/AssetFlow.API"
RUN dotnet build "AssetFlow.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "AssetFlow.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AssetFlow.API.dll"]
