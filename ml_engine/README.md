# Machine Learning Engine for H&M Personalized Fashion Recommendation System

This directory contains the machine learning components of the H&M Personalized Fashion Recommendation System. The goal of this project is to create a hybrid recommendation engine that combines collaborative filtering, content-based filtering, and image similarity to provide personalized fashion recommendations.

## Directory Structure

- **data_loader.py**: Functions for loading datasets from CSV files.
- **preprocess.py**: Handles data preprocessing steps, including cleaning and transforming data.
- **text_embeddings.py**: Generates text embeddings for product names and descriptions using SentenceTransformers.
- **image_embeddings.py**: Generates image embeddings using a pretrained CNN (e.g., ResNet50 or EfficientNet).
- **collaborative_filtering.py**: Implements collaborative filtering logic using implicit matrix factorization.
- **hybrid_recommender.py**: Combines different recommendation scores into a final score for each item.
- **train.py**: Trains the machine learning models and saves the trained model to a file.
- **model.pkl**: The trained machine learning model, saved for inference.
- **notebooks/**: Contains Jupyter notebooks for exploratory data analysis and model training.
- **requirements.txt**: Lists the dependencies required for the machine learning engine.

## Installation

To install the required packages, navigate to the `ml_engine` directory and run:

```
pip install -r requirements.txt
```

## Usage

1. **Data Loading**: Use `data_loader.py` to load the datasets from the `dataset` directory.
2. **Preprocessing**: Run `preprocess.py` to clean and preprocess the data.
3. **Training**: Execute `train.py` to train the recommendation models. The trained model will be saved as `model.pkl`.
4. **Inference**: Use the trained model in conjunction with `hybrid_recommender.py` to generate recommendations.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.