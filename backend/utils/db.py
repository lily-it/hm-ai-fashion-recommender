import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. Calculate the path to the .env file in the ROOT folder
# Structure: Root -> backend -> utils -> db.py
# We need to go up 3 levels to reach Root
current_file = Path(__file__).resolve()
root_dir = current_file.parent.parent.parent
env_path = root_dir / '.env'

# 2. Load the .env file explicitly
# Avoid non-ASCII characters in Windows console to prevent UnicodeEncodeError
print(f"Loading .env from: {env_path}")  # Debug print to confirm path
load_dotenv(dotenv_path=env_path)

# 3. Get Variables
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

# 4. Debug & Connect
if not url or not key:
    print(f"Error: Could not find keys in {env_path}")
    print("Make sure your .env file is in the project root and has SUPABASE_URL and SUPABASE_KEY")
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY")

supabase: Client = create_client(url, key)