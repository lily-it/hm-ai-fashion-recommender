# H&M Personalized Fashion Recommendation System - Backend

## Overview
This backend service is built using FastAPI and serves as the core of the H&M Personalized Fashion Recommendation System. It provides RESTful APIs to fetch personalized fashion recommendations, trending items, and similar items based on user preferences and interactions.

## Project Structure
- **main.py**: Entry point for the FastAPI application, setting up routes and middleware.
- **routes/**: Contains API route definitions.
  - **recommend.py**: Defines endpoints for recommendations, trending items, and similar items.
- **services/**: Contains business logic for fetching recommendations.
  - **recommender_service.py**: Implements the logic to interact with the machine learning model.
- **models/**: Defines request and response models for the API.
  - **request_models.py**: Contains Pydantic models for request validation.
- **utils/**: Contains utility functions for caching and logging.
  - **cache.py**: Implements caching mechanisms to improve performance.
  - **logger.py**: Sets up logging for monitoring and debugging.
- **requirements.txt**: Lists the dependencies required for the backend application.
- **Dockerfile**: Defines the Docker image for the backend application.
- **tests/**: Contains unit tests for the API routes.
  - **test_routes.py**: Tests for the API endpoints.

## API Endpoints
- **GET /recommendations/{customer_id}**: Fetch personalized recommendations for a given customer.
- **GET /trending**: Fetch trending items based on recent transaction frequency.
- **GET /similar-items/{article_id}**: Fetch items visually or textually similar to the selected article.

## Setup Instructions
1. **Install Dependencies**: Run `pip install -r requirements.txt` to install the necessary packages.
2. **Run the Application**: Use `uvicorn main:app --reload` to start the FastAPI server in development mode.
3. **Access the API**: The API will be available at `http://localhost:8000`.

## Docker
To build and run the backend service using Docker, use the following commands:
1. **Build the Docker Image**: `docker build -t hm-fashion-recommender-backend .`
2. **Run the Docker Container**: `docker run -p 8000:8000 hm-fashion-recommender-backend`

## Logging
The application uses Python's built-in logging module to log important events and errors. Logs can be found in the console output.

## Caching
Caching is implemented to improve the performance of frequently accessed data, reducing the load on the machine learning model.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.