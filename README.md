# CodeNova (🏗️ Project Codename)

A competitive programming platform inspired by LeetCode, HackerRank, and CodeChef, powered by machine learning and real-time contest management.

## 🚀 Features

- 🔐 User Sign Up / Sign In
- 🧠 Practice Mode with ML-suggested problems and personalized code feedback
- 🎯 Contest Mode with admin-hosted competitions and real-time leaderboards
- 💻 In-browser code editor with language selection and test case handling
- 🤖 ML-powered code analysis and plagiarism detection
- 👁️ Computer vision-based cheating detection during contests

---

## 🛠 Tech Stack

### 🔧 Frontend
- React.js
- Tailwind CSS
- Monaco Editor

### 🧠 Backend
- Python (FastAPI or Flask)
- PostgreSQL or MongoDB
- Judge0 API / Docker sandbox for code execution
- JWT for authentication

### 🤖 Machine Learning
- GPT-based code feedback (OpenAI API or CodeT5)
- Code similarity (TF-IDF + Cosine Similarity)
- Cheating detection using OpenCV

---

## 📁 Folder Structure

```
CodeNova/
│
├── backend/                   # Python backend (FastAPI or Flask)
│   ├── app/
│   │   ├── api/               # Routes and endpoints
│   │   ├── core/              # Core logic (auth, db, ML, etc.)
│   │   ├── models/            # Pydantic / DB models
│   │   ├── services/          # Code exec, ML feedback, etc.
│   │   └── main.py            # FastAPI app instance
│   └── requirements.txt       # Backend dependencies
│
├── frontend/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/        # Reusable components (Editor, Navbar)
│       ├── pages/             # SignIn, Home, Practice, Contest, Admin
│       ├── services/          # Axios API calls
│       └── App.jsx
│   └── package.json
│
├── database/                  # SQL / NoSQL schemas and seed data
│   └── schema.sql
│
├── ml/                        # ML models & scripts
│   ├── feedback_model/        # Code suggestion/analysis
│   ├── plagiarism_detector/   # Cosine similarity script
│   └── cheat_detection/       # OpenCV models and scripts
│
├── .env                       # Env variables (JWT_SECRET, DB creds, etc.)
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🧪 Getting Started (Local Setup)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/codenova.git
cd codenova
```

### 2. Set up backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Set up frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment variables
Create a `.env` in root or backend folder:
```
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:pass@localhost:5432/codenova
```

---

## 🎯 Roadmap

- [x] User authentication (Sign Up / Sign In)
- [ ] Code editor integration (Monaco + Judge0)
- [ ] ML problem suggestion engine
- [ ] Admin contest panel + leaderboard
- [ ] Webcam-based cheating prevention
- [ ] Code plagiarism detection
- [ ] UI polishing and deployment

---

## 🤝 Contributing

1. Fork the repo  
2. Create your feature branch (`git checkout -b feat/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add feature'`)  
4. Push to the branch (`git push origin feat/amazing-feature`)  
5. Open a Pull Request  

---

## 📄 License

MIT License. See `LICENSE` file for more info.

---

## ✨ Credits

Developed as a 5th semester Machine Learning Minor project by Pushpendra Meena, Nimish Baghwale, Puru Asthana.  
Mentored by Amit Shrivastav.
