# Trading Journal 📊

A personal trading journal web application designed to record, manage, and analyze trades in one place.

## ✨ Features

* 📝 Record trading details and trade results.
* 📊 Track trading performance and win rate.
* 📅 Organize trades by date and trading session.
* 🎯 Record entry setups, stop-losses, and take-profit levels.
* 🧠 Track trading psychology and emotional decisions.
* 📈 Review profitable and losing trades to identify areas for improvement.
* ✏️ Edit and manage trade records.

## 🛠️ Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **ODM:** Mongoose

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

* Node.js and npm
* MongoDB

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository's actual URL.

### 2. Open the project folder

```bash
cd YOUR_PROJECT_FOLDER
```

Run this from the directory containing the backend `package.json`.

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend project directory and configure your local MongoDB connection:

```env
MONGO_URI=mongodb://127.0.0.1:27017/tradingJournal
PORT=5000
```

Adjust the variable names and port to match your backend configuration.

**Important:** Never upload your actual `.env` file or database credentials to GitHub.

### 5. Start MongoDB

Make sure your local MongoDB server is running.

### 6. Start the backend

```bash
node server.js
```

Use the startup command defined in your `package.json` if it differs.

### 7. Open the application

Open the frontend's `index.html` in your browser, or use your configured local web server if your project requires one.

## 🎯 Project Goal

The goal of this project is to make trade tracking easier, improve trading discipline, and use recorded trade data to identify recurring mistakes and performance patterns.

## 🚀 Future Improvements

* Advanced performance analytics
* More detailed trading statistics
* Improved user interface
* Trade filtering and search
* Additional performance visualizations

## 👨‍💻 Author

Developed as a personal project to practice web development and build a practical tool for trading analysis.
