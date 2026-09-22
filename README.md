# 🌱 Sustainable Waste Management Assistant Using Generative AI

An AI-powered web application that helps users classify waste, receive proper disposal and recycling guidance, locate nearby collection centers, and visualize waste management statistics. This project promotes sustainable waste disposal practices using Generative AI and modern full-stack web technologies.

---

## 📌 Features

- 🤖 AI-powered Waste Classification
- ♻️ Disposal Instructions
- 🌍 Recycling Guidance
- ⚠️ Hazard Warning Detection
- 🌱 Eco-Friendly Suggestions
- 📊 Interactive Analytics Dashboard
- 📝 Scan History
- 📍 Collection Center Locator
- 🌐 REST API Integration
- 📱 Responsive User Interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Flask
- Flask-CORS
- Python

### AI Integration
- Groq API
- LLaMA 3.3-70B Versatile

### Maps
- Leaflet.js
- OpenStreetMap

### Analytics
- Chart.js

### Database
- Firebase Firestore *(or Local Storage/In-Memory for development)*

---

## 📂 Project Structure

```
Waste Management
│
├── backend
│   ├── app.py
│   ├── ai.py
│   ├── requirements.txt
│   ├── .env
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Sustainable-Waste-Management-Assistant.git
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Backend runs on:

```
http://127.0.0.1:5000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

---

## 📡 API Endpoints

### Analyze Waste

```
POST /api/analyze
```

Example Request

```json
{
  "item": "Battery"
}
```

---

### Get Scan History

```
GET /api/history
```

---

### Dashboard Analytics

```
GET /api/dashboard
```

---

### Collection Centers

```
GET /api/centers
```

---

## 📷 Application Workflow

1. User enters a waste item.
2. React frontend sends the request to the Flask backend.
3. Flask communicates with the Groq LLaMA model.
4. AI classifies the waste and generates disposal guidance.
5. Backend returns the result as JSON.
6. React displays waste details, dashboard analytics, history, and collection centers.

---

## 🎯 Project Objectives

- Encourage responsible waste disposal.
- Promote recycling awareness.
- Provide AI-assisted environmental guidance.
- Demonstrate Generative AI integration with full-stack development.
- Support smart city sustainability initiatives.

---

## 📈 Future Enhancements

- User Authentication
- Image-based Waste Recognition
- GPS-Based Collection Centers
- Multi-language Support
- Waste Pickup Requests
- Admin Dashboard
- AI Sustainability Reports

---

## 👨‍💻 Team Members

- Bokkasam Deepak
- Nemali Reddy Krishna
- Veerapuram Sreeeam
- Rajesh Chakali
- Kakarla Gnana Sathwick (Team Lead)

---

## 📜 License

This project was developed for educational purposes as part of the **SkillWallet Vibe Coding Program**.

---

### ⭐ If you like this project, don't forget to star the repository!
