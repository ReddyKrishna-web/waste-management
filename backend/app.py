from flask import Flask, request, jsonify
from flask_cors import CORS

from ai import analyze_waste

app = Flask(__name__)
CORS(app)

# In-memory history (resets when the server restarts)
history = []


@app.route("/")
def home():
    return {"message": "WasteGuide AI Backend Running"}


@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True)
    if not data or not data.get("item", "").strip():
        return jsonify({"error": "Please provide a waste item."}), 400

    item = data["item"].strip()

    try:
        result = analyze_waste(item)
    except Exception as e:
        return jsonify({"error": f"AI analysis failed: {e}"}), 500

    record = {"item": item, "result": result}
    history.append(record)
    return jsonify(result)


@app.route("/api/history")
def get_history():
    return jsonify(history)


@app.route("/api/dashboard")
def dashboard():
    total = len(history)
    recyclable = 0
    hazardous = 0
    categories = {}

    for h in history:
        r = h["result"]
        if str(r.get("recyclable", "")).lower() == "yes":
            recyclable += 1
        if "hazard" in str(r.get("category", "")).lower() or "yes" in str(r.get("hazard", "")).lower():
            hazardous += 1
        c = r.get("category", "Unknown")
        categories[c] = categories.get(c, 0) + 1

    return jsonify({
        "total": total,
        "recyclable": recyclable,
        "hazardous": hazardous,
        "categories": categories,
    })


@app.route("/api/centers")
def centers():
    return jsonify([
        {"name": "Recycling Center", "lat": 13.6288, "lng": 79.4192},
        {"name": "E-Waste Center", "lat": 13.6350, "lng": 79.4205},
        {"name": "Organic Waste Center", "lat": 13.6200, "lng": 79.4300},
    ])


@app.errorhandler(404)
def not_found(_e):
    return jsonify({"error": "Endpoint not found"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
