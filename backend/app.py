from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
from bson.objectid import ObjectId  # necessario per usare ObjectId con PyMongo
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")

print("MONGO_URI =", app.config["MONGO_URI"])

mongo = PyMongo(app)
print("Mongo DB:", mongo.db)

# Ottiene un certo numero di carte
@app.route("/carte", methods=["GET"])
def get_carte():
    limit = int(request.args.get("limit", 0))
    query = mongo.db.carte.find()
    if limit > 0:
        query = query.limit(limit)
    cartes = list(query)
    return jsonify([{**c, "_id": str(c["_id"])} for c in cartes])

@app.route("/collezionisti", methods=["POST"])
def crea_collezionista():
    d = request.json
    res = mongo.db.collezionisti.insert_one({"nome": d["nome"], "email": d["email"], "carte_possedute": []})
    return jsonify({"_id": str(res.inserted_id)}), 201

@app.route("/collezionisti/<id>/carte", methods=["PUT"])
def aggiungi_carta(id):
    carta = request.json["id_carta"]
    mongo.db.collezionisti.update_one({"_id": ObjectId(id)}, {"$push": {"carte_possedute": ObjectId(carta)}})
    return "", 204

@app.route("/collezionisti/<id>", methods=["GET"])
def get_collezionista(id):
    agg = mongo.db.collezionisti.aggregate([
        {"$match": {"_id": ObjectId(id)}},
        {"$lookup": {
            "from": "carte",
            "localField": "carte_possedute",
            "foreignField": "_id",
            "as": "dettagli_carte"
        }}
    ])
    col = next(agg, None)
    col["_id"] = str(col["_id"])
    return jsonify(col)

@app.route("/")
def home():
    return "Backend Yugioh attivo!"

if __name__ == "__main__":
    app.run(debug=True)
