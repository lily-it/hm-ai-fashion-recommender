import pandas as pd
import random
from datetime import datetime, timedelta
import os

def generate_transactions():
    print("⏳ Generating 2,000 Transactions...")

    # Humare paas 1 se 40 tak IDs hain
    article_ids = list(range(1, 41))   # Products 1-40
    customer_ids = list(range(1, 41))  # Customers 1-40

    transactions = []
    start_date = datetime(2023, 1, 1)

    # 2,000 Fake Entries Generate Karo
    for _ in range(2000):
        aid = random.choice(article_ids)
        cid = random.choice(customer_ids)
        
        # Random date (pichle 365 dino mein)
        random_days = random.randint(0, 365)
        t_date = start_date + timedelta(days=random_days)
        
        transactions.append([aid, cid, t_date.strftime("%Y-%m-%d")])

    # DataFrame banao aur Save karo
    df = pd.DataFrame(transactions, columns=["article_id", "customer_id", "transaction_date"])
    df = df.sort_values(by="transaction_date")

    output_path = "dataset/transactions.csv"
    
    # Folder ensure karo
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    df.to_csv(output_path, index=False)
    print(f"✅ Success! {len(df)} transactions saved to {output_path}")

if __name__ == "__main__":
    generate_transactions()