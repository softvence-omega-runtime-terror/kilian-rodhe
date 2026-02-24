#!/bin/bash

# Build and run the Docker container
echo "Building Docker image..."
docker compose build

echo "Starting container..."
docker compose up -d

echo "Checking container status..."
docker compose ps

echo ""
echo "Application running at http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f    # View logs"
echo "  docker compose down       # Stop container"
echo "  docker compose restart    # Restart container"
