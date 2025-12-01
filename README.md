# 🧠 AI Mental Health Fitness Coach

## 📌 Project Overview
This project is an **AI-powered mental health fitness coach** designed not to build a production-ready AI system, but to **explore and understand architectural design principles**.  
The main focus is on applying **layered architecture** to separate concerns across different layers (presentation, business logic, and data access), ensuring scalability, maintainability, and clarity in design.

---
## 🏗️ Architectural Design
We adopted a **Layered Architecture** pattern with the following layers:

- **Presentation Layer (Frontend)**  
  - Built with **TypeScript + React (TSX)**.  
  - Handles user interactions, UI rendering, and API calls to the backend.  
  - Provides a clean interface for users to interact with the AI coach.

  Run `npm run dev` to start the development server.
  
- **Business Logic Layer (Backend)**  
  - Implemented in **Node.js with TypeScript**.  
  - Manages request handling, validation, and orchestration of AI model calls.  
  - Ensures separation of concerns between frontend and data/model access.

  Run `npm start` to start the business logic layer

- **Data/Integration Layer (AI Model)**  
  - Uses **Gemini, Assembly Ai and Luxand Cloud** via API calls.  
  - Provides NLP capabilities for mental health and fitness coaching responses.  

---

## ⚙️ Tech Stack
- **Frontend:** React + TypeScript (TSX)  
- **Backend:** Node.js  
- **AI Model:** Gemini, Assembly AI & Luxand Cloud 
- **Architecture:** Layered (Presentation → Business Logic → Data/Integration)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.x recommended)  
- npm
- Gemini, AssemblyAI and Luxand Cloud api keys

### Installation
```bash
# Clone the repository
git clone https://github.com/ShadowFighterm/ai-mental-health-app.git

# Navigate into the project
cd ai-mental-health-app

```

- **Frontend**
```bash
# Folder root
cd frontend

# Install dependencies 
npm install

# Run
npm run dev

```

- **Backend**
```bash
# Folder root
cd backend

# Install dependencies 
npm install

# Run
npm start
```


