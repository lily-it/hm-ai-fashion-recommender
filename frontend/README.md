# H&M Personalized Fashion Recommendation System - Frontend

This is the frontend application for the H&M Personalized Fashion Recommendation System, built using Next.js, TypeScript, and Tailwind CSS. The application provides a user-friendly interface for exploring fashion items, receiving personalized recommendations, and managing user preferences.

## Project Structure

- **app/**: Contains the main application pages.
  - **layout.tsx**: Defines the main layout and global styles.
  - **page.tsx**: Home page featuring the hero section and personalized recommendations.
  - **explore/**: Page displaying a grid of all products with filters.
  - **profile/**: Page for users to set and save their preferences.
  - **api/**: Optional proxy for handling API requests to the backend.

- **components/**: Contains reusable UI components.
  - **Navbar.tsx**: Navigation bar with a search feature.
  - **ProductCard.tsx**: Displays individual product cards.
  - **RecommendationSection.tsx**: Shows personalized recommendations.
  - **HeroSection.tsx**: Displays the hero banner with animations.

- **styles/**: Contains global CSS styles.
- **public/**: Contains static assets like images.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd hm-fashion-recommender/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server, run:
```
npm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, run:
```
npm run build
```

### Docker

To build and run the frontend using Docker, use the following command:
```
docker build -t hm-fashion-frontend .
```

## API Integration

The frontend communicates with the backend API for fetching recommendations and trending items. Ensure the backend is running at the specified API URL.

### Environment Variables

Set the following environment variable in your `.env` file:
```
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.