# H&M Personalized Fashion Recommendation System

## Overview
The H&M Personalized Fashion Recommendation System is a full-stack web application designed to provide personalized fashion recommendations to users. The application leverages machine learning techniques to analyze user preferences and product features, offering a tailored shopping experience.

## Project Structure
The project is organized into three main components:

- **Frontend**: Built with Next.js, TypeScript, and Tailwind CSS, providing a responsive user interface.
- **Backend**: Developed using FastAPI, serving RESTful APIs for recommendations and data handling.
- **Machine Learning Engine**: Implements a hybrid recommendation system using collaborative filtering, content-based filtering, and image similarity.

## Technologies Used
- **Frontend**: 
  - Next.js
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Framer Motion

- **Backend**: 
  - Python
  - FastAPI
  - Machine Learning Libraries (implicit, SentenceTransformers, PyTorch)

- **Database**: 
  - CSV files for datasets

## Features
- Personalized fashion recommendations based on user preferences and behavior.
- Trending items based on recent transaction frequency.
- Similar items based on visual and textual features.
- User profile management for saving preferences.

## Getting Started

### Prerequisites
- Node.js and npm for the frontend
- Python 3.7+ for the backend
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hm-fashion-recommender
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Machine Learning Engine Setup**
   ```bash
   cd ml_engine
   pip install -r requirements.txt
   ```

### Running the Application

- **Start the Backend**
  ```bash
  cd backend
  uvicorn main:app --reload
  ```

- **Start the Frontend**
  ```bash
  cd frontend
  npm run dev
  ```

- **Using Docker (optional)**
  - Build and run the Docker containers using the provided `docker-compose.yml`.

### API Endpoints
- **GET /recommendations/{customer_id}**: Fetch personalized recommendations for a user.
- **GET /trending**: Retrieve trending fashion items.
- **GET /similar-items/{article_id}**: Get items similar to a specified article.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Inspired by the H&M Fashion Recommendation Kaggle dataset.
- Utilizes various machine learning techniques for enhanced recommendations.