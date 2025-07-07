import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client['yugioh_db']

df = pd.read_csv("../dataset/cards.csv")

# Sostituisci tutti i NaN con None (che diventa null in JSON)
df = df.where(pd.notnull(df), None)

records = df.to_dict(orient='records')

# Pulizia: rimuovi vecchia collezione
db.carte.drop()

# Inserisci i nuovi documenti
db.carte.insert_many(records)

print("Carte importate:", db.carte.count_documents({}))
