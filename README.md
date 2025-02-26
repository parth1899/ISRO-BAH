# 🚀 ISRO-BAH: Geospatial Context-Aware Chatbot  

## 🏆 About the Project  

This **Geospatial Context-Aware Chatbot** was developed for **ISRO's Bharatiya Antariksh Hackathon 2024**, where our team, **"The Fine Tuners"**, secured a **Top 5 position** across all problem statements.  

The chatbot allows users to query geospatial data **in natural language** and receive **interactive maps & summaries** using state-of-the-art AI techniques.  

## 🌍 Key Features  

🔍 **Geospatial Query Understanding** – Uses a **fine-tuned BERT model** to interpret queries accurately.  
🗺️ **Real-Time Geospatial Mapping** – Plots **maps** based on user queries (e.g., *"Show the water cover of Maharashtra"*).  
⚡ **Efficient Data Retrieval** – Uses **Qdrant** as a vector database for fast and precise searches.  
🤖 **AI-Powered Summarization** – Implements **Retrieval-Augmented Generation (RAG)** for context-aware responses.  
⚙️ **Optimized Backend & APIs** – Flask-based **REST API** and Django-powered backend.  
💻 **Intuitive Frontend** – Built with **React** for an interactive user experience.  

## 🏗️ Technology Stack  

- **Frontend:** React, TypeScript, Vite  
- **Backend:** Django, Flask, Python  
- **LLM & AI:** Groq Fast AI Inference, Llama 3.1, BERT  
- **Vector Search:** Qdrant  

## 🛠 Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/parth1899/ISRO-BAH
cd ISRO-BAH
```

### 2️⃣ Frontend Setup  
```bash
cd frontend
npm install
npm start
```

### 3️⃣ Backend Setup  
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
python manage.py runserver
```

### 4️⃣ Vector Database (Qdrant) Setup  
Run Qdrant using Docker:  
```bash
docker run -p 6333:6333 -v .:/qdrant/storage/ qdrant/qdrant
``` 

## 🧑‍💻 Contributors  

- [Parth Petkar](https://github.com/parthpetkar)  
- [Parth Kalani](https://github.com/contributor)  
- [Hritesh Maikap](https://github.com/hriteshMaikap)  
- [Nidhish Wakodikar](https://github.com/Nidhish-714)  

## 🤝 How to Contribute  

1. **Fork** the repo  
2. **Create a new branch**: `git checkout -b feature-branch`  
3. **Commit your changes**: `git commit -m "Add a new feature"`  
4. **Push to the branch**: `git push origin feature-branch`  
5. **Submit a Pull Request**  
