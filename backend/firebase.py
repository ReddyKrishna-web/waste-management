import os

import firebase_admin
from firebase_admin import credentials, firestore

_SERVICE_ACCOUNT_FILE = os.path.join(
    os.path.dirname(__file__),
    "waste-management-3f242-firebase-adminsdk-fbsvc-31cfd8c911.json",
)

_firebase_app = None
db = None

if os.path.exists(_SERVICE_ACCOUNT_FILE):
    try:
        cred = credentials.Certificate(_SERVICE_ACCOUNT_FILE)
        _firebase_app = firebase_admin.initialize_app(cred)
        db = firestore.client()
    except Exception as e:
        print(f"[firebase] initialization failed: {e}")
else:
    print(f"[firebase] service account file not found at {_SERVICE_ACCOUNT_FILE}; db is disabled")
