import sys
import os
import json
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

# 1. Setup paths (Go up 2 levels from 'scripts' to 'backend' to 'root')
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(os.path.join(root_dir, 'backend'))

# 2. Load Env
env_path = os.path.join(root_dir, 'backend', '.env')
load_dotenv(dotenv_path=env_path)

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("❌ Error: Missing API Keys. Check your .env file.")
    exit()

supabase: Client = create_client(url, key)

# 3. Load your Dataset
# CHANGE THIS FILENAME to match your actual dataset (e.g., transactions_train.csv or articles.csv)
# Assuming you have a CSV or JSON in the 'dataset' folder
DATASET_PATH = os.path.join(root_dir, 'dataset', 'articles.csv') 

def upload_data():
    if not os.path.exists(DATASET_PATH):
        print(f"❌ Error: File not found at {DATASET_PATH}")
        return

    print("⏳ Reading dataset...")
    # Load only necessary columns to save memory
    df = pd.read_csv(DATASET_PATH, dtype=str)
    
    # Rename columns to match Supabase schema if needed
    # Supabase expects: article_id, name, category, price, image_url, description
    # Adjust these mappings based on your actual CSV headers:
    df = df.rename(columns={
        'article_id': 'article_id',
        'prod_name': 'name',
        'product_type_name': 'category',
        'detail_desc': 'description'
    })
    
    # Add dummy price/image if missing (Your CSV might not have them)
    if 'price' not in df.columns:
        df['price'] = 29.99 
    if 'image_url' not in df.columns:
        df['image_url'] = ''

    # Select only the columns that exist in our table
    df = df[['article_id', 'name', 'category', 'price', 'image_url', 'description']]
    
    # Convert to dictionary
    products = df.head(1000).to_dict(orient='records') # Upload first 1000 for testing

    print(f"🚀 Uploading {len(products)} products to Supabase...")
    
    try:
        # Upsert = Insert or Update if exists
        response = supabase.table("products").upsert(products).execute()
        print("✅ Success! Products uploaded.")
    except Exception as e:
        print(f"❌ Upload Failed: {e}")

if __name__ == "__main__":
    upload_data()