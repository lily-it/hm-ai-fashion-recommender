import pandas as pd

def load_data(customers_path, articles_path, transactions_path):
    customers = pd.read_csv(customers_path)
    articles = pd.read_csv(articles_path)
    transactions = pd.read_csv(transactions_path)

    return customers, articles, transactions


def preprocess_data(customers, articles, transactions):
    print("🔄 Preprocessing started...")

    # Reduce memory usage
    transactions["article_id"] = transactions["article_id"].astype(str)
    transactions["customer_id"] = transactions["customer_id"].astype(str)
    articles["article_id"] = articles["article_id"].astype(str)

    # Merge article metadata
    merged = transactions.merge(articles, on="article_id", how="left")

    # Keep essential columns for ML
    merged = merged[[
        "customer_id", "article_id", "price",
        "prod_name", "product_type_name",
        "colour_group_name", "department_name"
    ]]

    merged.dropna(subset=["prod_name"], inplace=True)
    merged.fillna("", inplace=True)

    print("✅ Preprocessing complete. Rows:", len(merged))
    return merged
