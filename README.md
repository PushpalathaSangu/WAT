
## 📘 Weekly Assessment Test (WAT)  


## 📌 Overview
The **Weekly Assessment Test (WAT)** is a full-stack web application designed to automate and streamline the process of conducting weekly tests in educational institutions. It facilitates seamless test creation, administration, and evaluation for faculty, while providing students with a secure and efficient test-taking environment.

Built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js), the platform supports role-based access, real-time scoring for objective-type questions, and manual grading support for subjective questions.


## 🚀 Features

### 👩‍🎓 Student Features
- Take scheduled assessments with automatic timers.
- View test history, scores, and performance analytics.
- Get real-time feedback for objective questions.

### 👨‍🏫 Faculty Features
- Create and schedule assessments with question banks.
- Auto-score MCQs and manually grade descriptive answers.
- Analyze performance with dynamic dashboards and reports.

### 🛠 Admin Features
- Manage users (students and faculty).
- Assign academic years and permissions.
- Monitor system activities and view all test cycles.

---

## 🧠 System Architecture
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT-based token system
- **Deployment:** Vercel / Heroku

---

## ⚙️ Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/PushpalathaSangu/WAT.git
cd WAT 
```

### 2. Install Dependencies

#### backend
```bash
cd backend
npm install
```
#### frontend
```bash
cd ../frontend
npm install
```
### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory with the following content:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=4000
GOOGLE_API_KEY=your_geminiapi_key
```
### 4. Start the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend Client
```bash
cd ../frontend
npm run dev
```


