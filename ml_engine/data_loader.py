import pandas as pd
import os

def load_customers(file_path: str) -> pd.DataFrame:
    return pd.read_csv(file_path)

def load_articles(file_path: str) -> pd.DataFrame:
    return pd.read_csv(file_path)

def load_transactions(file_path: str) -> pd.DataFrame:
    return pd.read_csv(file_path)

def load_images(images_folder: str) -> list:
    return [os.path.join(images_folder, img) for img in os.listdir(images_folder) if img.endswith(('.png', '.jpg', '.jpeg'))]

def load_data(customers_path: str, articles_path: str, transactions_path: str, images_folder: str):
    customers = load_customers(customers_path)
    articles = load_articles(articles_path)
    transactions = load_transactions(transactions_path)
    images = load_images(images_folder)
    
    return customers, articles, transactions, images