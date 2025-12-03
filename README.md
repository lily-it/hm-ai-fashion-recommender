# H&M Personalized Fashion Recommendation System

## 🌟 Overview
The **H&M Personalized Fashion Recommendation System** is a full-stack **machine learning–powered web application** that provides personalized fashion recommendations based on user behavior, product attributes, and visual similarity.

🔗 **Live Demo:** https://hm-ai-fashion-recommender-kayfay46o-lily-its-projects.vercel.app/

---

## 🧱 Project Structure
The system consists of three main components:

### **🖥️ Frontend**
- Built with **Next.js**, **TypeScript**, and **Tailwind CSS**
- Responsive UI with **shadcn/ui** components
- Smooth transitions using **Framer Motion**

### **⚙️ Backend**
- Powered by **FastAPI**
- Exposes RESTful endpoints for recommendations and data access

### **🤖 Machine Learning Engine**
- Hybrid recommendation pipeline using:
  - Collaborative Filtering (implicit)
  - Content-Based Filtering
  - Image embeddings via **SentenceTransformers** + **PyTorch**

---

## 🛠️ Technologies Used

### **Frontend**
- Next.js  
- TypeScript  
- Tailwind CSS  
- shadcn/ui  
- Framer Motion  

### **Backend**
- Python  
- FastAPI  
- implicit  
- SentenceTransformers  
- PyTorch  

### **Database / Data**
- CSV files (Kaggle H&M dataset)

---

## 🚀 Features
- 🔍 **Personalized recommendations** based on user purchase history  
- 👗 **Image-based similarity search** (visually similar items)  
- 📈 **Trending items** computed from transaction frequency  
- 👤 **User profile preference handling**  
- ⚡ **Fast, responsive full-stack web app**  

---

## 🏁 Getting Started

### **Prerequisites**
- Node.js & npm  
- Python 3.7+  
- Docker (optional)

---

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hm-fashion-recommender
2. Frontend Setup
cd frontend
npm install

3. Backend Setup
cd backend
pip install -r requirements.txt

4. Machine Learning Engine Setup
cd ml_engine
pip install -r requirements.txt

▶️ Running the Application
Start Backend
cd backend
uvicorn main:app --reload

Start Frontend
cd frontend
npm run dev
