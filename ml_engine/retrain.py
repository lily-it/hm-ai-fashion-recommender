import os
import sys
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

# Path Setup
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from build_hybrid import build_hybrid_model # Humara existing build logic use karenge

# 1. Load Environment Variables (Supabase Keys)
# Root folder ki .env file dhoondo
env_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Supabase keys not found in .env")
    sys.exit(1)

# 2. Connect to Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_new_interactions():
    print("📡 Fetching new data from Supabase...")
    
    # Fetch all interactions
    response = supabase.table("user_interactions").select("*").execute()
    data = response.data
    
    if not data:
        print("⚠️ No new interactions found.")
        return pd.DataFrame()

    df = pd.DataFrame(data)
    
    # 3. Convert Events to Scores (Implicit Ratings)
    # View = 1 point, Add to Cart = 3 points, Purchase = 5 points
    event_weights = {
        'view': 1,
        'add_to_cart': 3,
        'purchase': 5
    }
    
    # Map interaction_type to numerical score
    df['price'] = 0 # Dummy price column needed for consistency
    df['sales_channel_id'] = 1 # Dummy channel
    df['t_dat'] = pd.to_datetime('today') # Current date
    
    # Map weights
    df['score'] = df['interaction_type'].map(event_weights).fillna(1)
    
    # Clean up columns to match original CSV format (customer_id, article_id)
    # Note: Ensure frontend sends 'customer_id' as matching format
    df = df.rename(columns={'user_id': 'customer_id'})
    
    print(f"✅ Fetched {len(df)} new interactions.")
    return df[['customer_id', 'article_id', 't_dat', 'price', 'sales_channel_id', 'score']]

def retrain_pipeline():
    print("🚀 Starting Retraining Pipeline...")
    
    # A. Load Original Static Data (CSV)
    # Adjust path to where your original CSV is
    csv_path = os.path.join(os.path.dirname(__file__), '../data/transactions_train.csv')
    
    if os.path.exists(csv_path):
        print("📂 Loading original CSV data...")
        original_df = pd.read_csv(csv_path).head(5000) # Limiting for speed (Adjust as needed)
        original_df['score'] = 1 # Default score for old data
    else:
        print("⚠️ Original CSV not found, starting fresh.")
        original_df = pd.DataFrame()

    # B. Load New Data (Supabase)
    new_df = fetch_new_interactions()
    
    # C. Merge Data
    if new_df.empty and original_df.empty:
        print("❌ No data available to train.")
        return

    full_df = pd.concat([original_df, new_df], ignore_index=True)
    print(f"🧠 Total Training Samples: {len(full_df)}")
    
    # D. Rebuild Model
    # Hum 'build_hybrid.py' ka logic call karenge par naye DataFrame ke saath.
    # Note: Humein build_hybrid.py ko thoda modify karna padega taaki wo DF accept kare,
    # ya phir hum is DF ko temporary CSV bana ke save kar dein.
    
    # Method: Save to temp CSV -> Run Build Process
    temp_csv_path = os.path.join(os.path.dirname(__file__), 'temp_training_data.csv')
    full_df.to_csv(temp_csv_path, index=False)
    
    print("🔄 Re-building Hybrid Model...")
    # Yahan hum existing build script ko import karke function call kar sakte hain
    # lekin abhi ke liye simple tarika: command line execution
    os.system(f"python ml_engine/build_hybrid.py --data_path {temp_csv_path}")
    
    # Cleanup
    if os.path.exists(temp_csv_path):
        os.remove(temp_csv_path)
        
    print("🎉 Model Retrained & Saved Successfully!")

if __name__ == "__main__":
    retrain_pipeline()