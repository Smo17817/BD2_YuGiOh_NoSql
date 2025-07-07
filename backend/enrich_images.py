import requests
from pymongo import MongoClient

client = MongoClient("<MONGO_URI>")
db = client['ygo_db']
for card in db.carte.find():
    name = card.get('name')
    res = requests.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', params={'name': name})
    j = res.json()
    if 'data' in j:
        img = j['data'][0]['card_images'][0]['image_url']
        db.carte.update_one({'_id': card['_id']}, {'$set': {'image_url': img}})
