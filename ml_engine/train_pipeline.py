import pandas as pd
from preprocess import preprocess_data

def load_raw_data():
    customers = pd.read_csv("dataset/customers.csv")
    articles = pd.read_csv("dataset/articles.csv")
    transactions = pd.read_csv("dataset/transactions.csv")

    return customers, articles, transactions

def preprocess():
    customers, articles, transactions = load_raw_data()
    merged = preprocess_data(customers, articles, transactions)

    merged.to_csv("dataset/preprocessed_data.csv", index=False)
    print("✅ Preprocessing completed. Saved preprocessed_data.csv")

if __name__ == "__main__":
    preprocess()
