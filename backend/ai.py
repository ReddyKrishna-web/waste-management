import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def analyze_waste(item):

    prompt = f"""
You are a Waste Management Expert.

Analyze the following waste item.

Waste Item:
{item}

Return ONLY JSON.

{{
"category":"",
"recyclable":"",
"hazard":"",
"instructions":[
"",
"",
""
],
"ecoSuggestion":""
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role":"user",
                "content":prompt
            }
        ],
        temperature=0.2
    )

    answer = response.choices[0].message.content

    print("========== GROQ RESPONSE ==========")
    print(answer)
    print("===================================")

    try:
    # Remove markdown formatting
        answer = answer.replace("```json", "").replace("```", "").strip()

        return json.loads(answer)

    except Exception as e:

        return {
            "category": "Unknown",
            "recyclable": "Unknown",
            "hazard": "Unknown",
            "instructions": [
                "AI returned an invalid JSON response."
            ],
            "ecoSuggestion": str(e)
        }
    return json.loads(answer)