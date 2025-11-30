from pymongo import MongoClient
from decouple import config

MONGO_URL = config("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["simulador"]
