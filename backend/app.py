from flask import Flask, request, jsonify
from flask_cors import CORS

from ai import analyze_waste

app = Flask(__name__)

history = []

CORS(app)


@app.route("/")

def home():

    return {
        "message":"WasteGuide AI Backend Running"
    }


@app.route("/api/analyze",methods=["POST"])
def analyze():

    data=request.json

    item=data["item"]

    result=analyze_waste(item)

    history.append({

        "item":item,

        "result":result

    })

    return jsonify(result)
@app.route("/api/history")

def get_history():

    return jsonify(history)


if __name__=="__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
@app.route("/api/dashboard")
def dashboard():

    total=len(history)

    recyclable=0

    hazardous=0

    categories={}

    for h in history:

        r=h["result"]

        if r["recyclable"].lower()=="yes":
            recyclable+=1

        if "hazard" in r["category"].lower():
            hazardous+=1

        c=r["category"]

        categories[c]=categories.get(c,0)+1

    return jsonify({

        "total":total,

        "recyclable":recyclable,

        "hazardous":hazardous,

        "categories":categories

    })
@app.route("/api/centers")
def centers():

    return jsonify([

        {

            "name":"Recycling Center",

            "lat":13.6288,

            "lng":79.4192

        },

        {

            "name":"E-Waste Center",

            "lat":13.6350,

            "lng":79.4205

        },

        {

            "name":"Organic Waste Center",

            "lat":13.6200,

            "lng":79.4300

        }

    ])