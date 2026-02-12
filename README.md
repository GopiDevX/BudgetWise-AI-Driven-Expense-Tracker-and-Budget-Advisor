# 💰 BudgetWise – AI Driven Expense Tracker & Analyzer

BudgetWise is a Full Stack Java application designed to help users track expenses, manage budgets, and gain AI-powered financial insights for smarter decision-making.

Built as part of my Java Full Stack Internship, this project demonstrates secure authentication, RESTful APIs, and modern frontend development practices.

---

## 🚀 Features

- 🔐 JWT-based Authentication (Login / Register / OTP)
- 👤 Role-based Authorization
- 💳 Expense & Transaction Management
- 📊 Budget Creation & Tracking
- 📈 AI Insights & Analytics Dashboard
- 📁 Category Management
- 🌙 Dark Mode UI
- 📧 Email & OTP Verification

---

## 🛠 Tech Stack

### 🔹 Frontend
- React.js
- Context API
- Custom Hooks
- CSS (Dark Mode Support)

### 🔹 Backend
- Spring Boot
- Spring Security
- JWT Authentication
- Maven
- REST APIs

### 🔹 Database
- MySQL
- JPA / Hibernate

### 🔹 Tools
- Postman
- Git & GitHub
- VS Code

---

## 📂 Project Structure

```
BudgetWise
│
├── backend/        # Spring Boot Application
├── frontend/       # React Application
└── .gitignore
```

---

## ⚙️ How to Run Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/GopiDevX/BudgetWise-AI-Driven-Expense-Tracker-and-Budget-Advisor.git
```

---

### 2️⃣ Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Configure your `application.properties` with:

```
spring.datasource.url=jdbc:mysql://localhost:3306/budgetwise
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs on:

```
http://localhost:3000
```

---

## 🔐 Security Highlights

- Stateless JWT Authentication
- Password Encryption
- Protected Routes
- Role-Based Access Control

---

## 📌 Future Enhancements

- AI-based Spending Prediction
- Advanced Data Visualization
- Mobile Responsive Optimization
- Cloud Deployment (AWS / Docker)

---

## 👨‍💻 Author

Gopinathan M
Java Full Stack Developer  
Passionate about building scalable, secure, and intelligent web applications.

---

⭐ If you found this project interesting, feel free to star the repository!
