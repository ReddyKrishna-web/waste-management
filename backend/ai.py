import os
import json
import re

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is missing. Add it to backend/.env, e.g.\n"
        "  GROQ_API_KEY=gsk_your_key_here"
    )

client = Groq(api_key=GROQ_API_KEY)

# llama-3.3-70b-versatile was decommissioned by Groq on 2026-08-16.
MODEL = "openai/gpt-oss-120b"


def _extract_json(text):
    """Pull the first JSON object out of a model response, tolerating markdown fences."""
    text = text.replace("```json", "").replace("```", "")
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in AI response")
    return json.loads(match.group(0))


def analyze_waste(item):
    prompt = f"""
You are a Waste Management Expert.

Analyze the following waste item and return disposal guidance.

Waste Item: {item}

Return ONLY a JSON object with exactly these keys (no extra text):
{{
  "category": "one of: Organic, Plastic, Paper, Glass, Metal, E-Waste, Hazardous, General",
  "recyclable": "Yes or No",
  "hazard": "short description of any hazard, or None",
  "instructions": ["3 short disposal steps"],
  "ecoSuggestion": "one eco-friendly alternative or reuse idea"
}}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        response_format={"type": "json_object"},
    )

    answer = response.choices[0].message.content

    try:
        return _extract_json(answer)
    except Exception as e:
        return {
            "category": "Unknown",
            "recyclable": "Unknown",
            "hazard": "Unknown",
            "instructions": ["AI returned an invalid response. Please try again."],
            "ecoSuggestion": str(e),
        }
