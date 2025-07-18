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

@app.route("/carte/upvotes", methods=["GET"])
def get_cards_by_upvotes():
    limit = int(request.args.get("limit", 10))
    query = mongo.db.carte.find().sort("upvotes", -1)
    if limit > 0:
        query = query.limit(limit)
    cartes = list(query)
    cartes_clean = [clean_nan({**c, "_id": str(c["_id"])}) for c in cartes]
    return jsonify(cartes_clean)

@app.route("/carta/<id>", methods=["GET"])
def get_carta_by_id(id):
    carta = mongo.db.carte.find_one({"_id": ObjectId(id)})
    if not carta:
        return jsonify({"error": "Carta non trovata"}), 404
    carta["_id"] = str(carta["_id"])
    carta = clean_nan(carta)
    return jsonify(carta)

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
    mongo.db.users.insert_one({
        "nome": nome,
        "email": email,
        "password": pw_hash,
        "preferiti": []  # campo per le carte preferite
    })
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
        return jsonify({
            "message": "Login effettuato",
            "user": {"nome": user["nome"], "email": user["email"]}
        }), 200
    return jsonify({"error": "Credenziali non valide"}), 401

@app.route("/utente/<email>", methods=["PUT"])
def update_utente(email):
    data = request.json
    user = mongo.db.users.find_one({"email": email})

    if not user:
        return jsonify({"error": "Utente non trovato"}), 404

    update_fields = {}

    if "nome" in data and data["nome"] != user.get("nome"):
        update_fields["nome"] = data["nome"]

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
        updated_user = mongo.db.users.find_one({"email": email}, {"password": 0})
        updated_user["_id"] = str(updated_user["_id"])
        return jsonify({"message": "Profilo aggiornato", "updatedUser": updated_user})

    return jsonify({"error": "Nessun dato da aggiornare"}), 400

### Gestione dei preferiti ###

@app.route("/preferiti/<email>", methods=["GET"])
def get_preferiti(email):
    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Utente non trovato"}), 404
    preferiti = user.get("preferiti", [])
    preferiti = [str(p) for p in preferiti]
    return jsonify({"preferiti": preferiti})

@app.route("/preferiti/<email>", methods=["POST"])
def aggiungi_preferito(email):
    data = request.json
    id_carta = data.get("id_carta")
    if not id_carta:
        return jsonify({"error": "id_carta richiesto"}), 400

    mongo.db.users.update_one(
        {"email": email},
        {"$addToSet": {"preferiti": ObjectId(id_carta)}}
    )
    return jsonify({"message": "Carta aggiunta ai preferiti"}), 200

@app.route("/preferiti/<email>", methods=["DELETE"])
def rimuovi_preferito(email):
    data = request.json
    id_carta = data.get("id_carta")
    if not id_carta:
        return jsonify({"error": "id_carta richiesto"}), 400

    mongo.db.users.update_one(
        {"email": email},
        {"$pull": {"preferiti": ObjectId(id_carta)}}
    )
    return jsonify({"message": "Carta rimossa dai preferiti"}), 200

# JOIN: Recupera i dettagli delle carte preferite di un utente
@app.route("/preferiti/dettagli/<email>", methods=["GET"])
def get_preferiti_con_dettagli(email):
    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Utente non trovato"}), 404

    ids = user.get("preferiti", [])
    carte = list(mongo.db.carte.find({"_id": {"$in": ids}}))

    # Applichiamo clean_nan + conversione _id
    carte_sanificate = [
        clean_nan({**c, "_id": str(c["_id"])}) for c in carte
    ]

    return jsonify(carte_sanificate)

if __name__ == "__main__":
    app.run(debug=True)
