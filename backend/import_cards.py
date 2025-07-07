import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client['ygo_db']
df = pd.read_csv("../dataset/cards.csv")
records = df.to_dict(orient='records')
db.carte.drop()
db.carte.insert_many(records)
print("Carte importate:", db.carte.count_documents({}))
