#!/bin/bash

# Start the backend FastAPI server
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# Start the frontend Next.js application
cd ../frontend
npm install
npm run dev -- -p 3000