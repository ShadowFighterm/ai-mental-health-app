@ -1,11 +1,53 @@
# 🧠 AI Mental Health Fitness Coach

  # AI Mental Fitness Coach UI
## 📌 Project Overview
This project is an **AI-powered mental health fitness coach** designed not to build a production-ready AI system, but to **explore and understand architectural design principles**.  
The main focus is on applying **layered architecture** to separate concerns across different layers (presentation, business logic, and data access), ensuring scalability, maintainability, and clarity in design.

  This is a code bundle for AI Mental Fitness Coach UI. The original project is available at https://www.figma.com/design/tJyvDSDxX3OAPzYLXyQBZs/AI-Mental-Fitness-Coach-UI.
---

  ## Running the code
## 🏗️ Architectural Design
We adopted a **Layered Architecture** pattern with the following layers:

  Run `npm i` to install the dependencies.
- **Presentation Layer (Frontend)**  
  - Built with **TypeScript + React (TSX)**.  
  - Handles user interactions, UI rendering, and API calls to the backend.  
  - Provides a clean interface for users to interact with the AI coach.

  Run `npm run dev` to start the development server.
  
- **Business Logic Layer (Backend)**  
  - Implemented in **Node.js with TypeScript**.  
  - Manages request handling, validation, and orchestration of AI model calls.  
  - Ensures separation of concerns between frontend and data/model access.

- **Data/Integration Layer (AI Model)**  
  - Uses **Hugging Face models** via API calls.  
  - Provides NLP capabilities for mental health and fitness coaching responses.  
  - Abstracted behind backend services to keep the frontend decoupled.

---

## ⚙️ Tech Stack
- **Frontend:** React + TypeScript (TSX)  
- **Backend:** Node.js + TypeScript  
- **AI Model:** Hugging Face API (transformer-based NLP models)  
- **Architecture:** Layered (Presentation → Business Logic → Data/Integration)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.x recommended)  
- npm or yarn  
- Hugging Face API key  

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/mental-health-fitness-coach.git

# Navigate into the project
cd mental-health-fitness-coach

# Install dependencies
npm install
