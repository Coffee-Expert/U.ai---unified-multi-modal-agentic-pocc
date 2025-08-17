import shutil
import os

CHROMA_DB_PATH = os.path.join('chroma_db', 'database')

try:
    if os.path.exists(CHROMA_DB_PATH):
        shutil.rmtree(CHROMA_DB_PATH)
        print(" Deleted successfully")
    else:
        print("⚠️ Path doesn't exist")
except Exception as e:
    print(" Failed to delete:", e)
