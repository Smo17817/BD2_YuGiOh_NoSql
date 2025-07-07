from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
from bson.objectid import ObjectId
import os
import math
from flask_bcrypt import Bcrypt
import re

load_dotenv()
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
print("MONGO_URI =", app.config["MONGO_URI"])

mongo = PyMongo(app)
print("Mongo DB:", mongo.db)

def clean_nan(obj):
    if isinstance(obj, dict):
        return {k: clean_nan(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nan(i) for i in obj]
    elif isinstance(obj, float) and math.isnan(obj):
        return None
    else:
        return obj

@app.route("/carte", methods=["GET"])
def get_carte():
    limit = int(request.args.get("limit", 0))
    query = mongo.db.carte.find()
    if limit > 0:
        query = query.limit(limit)
    cartes = list(query)
    cartes_clean = [clean_nan({**c, "_id": str(c["_id"])}) for c in cartes]
    return jsonify(cartes_clean)

# recupera le 10 carte più popolari
@app.route("/carte/upvotes", methods=["GET"])
def get_cards_by_upvotes():
    limit = int(request.args.get("limit", 10))  # default 10 carte
    query = mongo.db.carte.find().sort("upvotes", -1)  # -1 = decrescente
    if limit > 0:
        query = query.limit(limit)
    cartes = list(query)
    cartes_clean = [clean_nan({**c, "_id": str(c["_id"])}) for c in cartes]
    return jsonify(cartes_clean)

# recupera una carta dato un id
@app.route("/carta/<id>", methods=["GET"])
def get_carta_by_id(id):
    carta = mongo.db.carte.find_one({"_id": ObjectId(id)})
    if not carta:
        return jsonify({"error": "Carta non trovata"}), 404
    carta["_id"] = str(carta["_id"])
    carta = clean_nan(carta) 
    return jsonify(carta)

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
    if col is None:
        return jsonify({"error": "Collezionista non trovato"}), 404
    col["_id"] = str(col["_id"])
    return jsonify(col)

@app.route("/")
def home():
    return "Backend Yugioh attivo!"

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    nome = data.get("nome")
    email = data.get("email")
    password = data.get("password")

    if not nome or not email or not password:
        return jsonify({"error": "Tutti i campi sono obbligatori"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Email non valida"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password deve essere lunga almeno 8 caratteri"}), 400
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email già registrata"}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.users.insert_one({"nome": nome, "email": email, "password": pw_hash})
    return jsonify({"message": "Utente registrato con successo"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email e password obbligatorie"}), 400

    user = mongo.db.users.find_one({"email": email})
    if user and bcrypt.check_password_hash(user["password"], password):
        return jsonify({"message": "Login effettuato", "user": {"nome": user["nome"], "email": user["email"]}}), 200
    return jsonify({"error": "Credenziali non valide"}), 401

from flask_bcrypt import check_password_hash

@app.route("/utente/<email>", methods=["PUT"])
def update_utente(email):
    data = request.json
    user = mongo.db.users.find_one({"email": email})

    if not user:
        return jsonify({"error": "Utente non trovato"}), 404

    update_fields = {}

    # Cambia nome se presente
    if "nome" in data and data["nome"] != user.get("nome"):
        update_fields["nome"] = data["nome"]

    # Cambia password se richiesto
    if "oldPassword" in data and "newPassword" in data:
        old_pw = data["oldPassword"]
        new_pw = data["newPassword"]
        if not bcrypt.check_password_hash(user["password"], old_pw):
            return jsonify({"error": "Vecchia password errata"}), 400
        if len(new_pw) < 8:
            return jsonify({"error": "La nuova password deve essere lunga almeno 8 caratteri"}), 400
        new_pw_hash = bcrypt.generate_password_hash(new_pw).decode('utf-8')
        update_fields["password"] = new_pw_hash

    if update_fields:
        mongo.db.users.update_one({"email": email}, {"$set": update_fields})
        updated_user = mongo.db.users.find_one({"email": email}, {"password": 0})  # escludi password
        updated_user["_id"] = str(updated_user["_id"])
        return jsonify({"message": "Profilo aggiornato", "updatedUser": updated_user})

    return jsonify({"error": "Nessun dato da aggiornare"}), 400

if __name__ == "__main__":
    app.run(debug=True)
