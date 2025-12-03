#!/bin/bash

# Build Docker images for frontend and backend
docker build -t hm-fashion-recommender-frontend ./frontend
docker build -t hm-fashion-recommender-backend ./backend

echo "Docker images built successfully."