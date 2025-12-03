# API Documentation for H&M Personalized Fashion Recommendation System

## Overview
This document provides an overview of the API endpoints available in the H&M Personalized Fashion Recommendation System. The backend is built using FastAPI and serves as the interface for the frontend application.

## Base URL
The base URL for the API is:
```
http://localhost:8000
```

## Endpoints

### 1. Get Recommendations
- **Endpoint:** `/recommendations/{customer_id}`
- **Method:** `GET`
- **Description:** Fetch personalized fashion recommendations for a specific customer.
- **Path Parameters:**
  - `customer_id` (string): The unique identifier for the customer.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "article_id": "12345",
        "name": "Cotton Oversized Jacket",
        "price": 2499,
        "category": "Jackets",
        "score": 0.89,
        "image_url": "/images/...jpg"
      }
    ]
    ```

### 2. Get Trending Items
- **Endpoint:** `/trending`
- **Method:** `GET`
- **Description:** Retrieve a list of popular items based on recent transaction frequency.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "article_id": "67890",
        "name": "Classic White T-Shirt",
        "price": 999,
        "category": "T-Shirts",
        "score": 0.95,
        "image_url": "/images/...jpg"
      }
    ]
    ```

### 3. Get Similar Items
- **Endpoint:** `/similar-items/{article_id}`
- **Method:** `GET`
- **Description:** Fetch items that are visually or textually similar to the selected article.
- **Path Parameters:**
  - `article_id` (string): The unique identifier for the article.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "article_id": "54321",
        "name": "Denim Jacket",
        "price": 1999,
        "category": "Jackets",
        "score": 0.87,
        "image_url": "/images/...jpg"
      }
    ]
    ```

## Error Handling
In case of an error, the API will return a JSON response with an appropriate status code and message. For example:
- **404 Not Found**
  ```json
  {
    "detail": "Customer not found"
  }
  ```

## CORS Support
The API supports Cross-Origin Resource Sharing (CORS) to allow requests from the frontend application.

## Conclusion
This API documentation outlines the key endpoints for the H&M Personalized Fashion Recommendation System. For further details on the implementation, please refer to the backend codebase.