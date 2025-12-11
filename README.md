---

# 🍣 Sushi Quiz — Interactive Social Quiz

*A sushi-themed interactive quiz web application built with Node.js & Express, containerized with Docker, and automatically deployed via GitHub Actions + Render.*

---

## 📸 Demo

https://sushiquiz.onrender.com/

---
**Sushi Quiz** is a simple but engaging interactive quiz app where the user guesses sushi names from images.
The goal is to create:

* A **clean, responsive web interface**
* A backend that handles quiz logic
* A **Dockerized** application ready for production
* A **CI/CD pipeline** that automatically builds & deploys the app
* A real cloud deployment using **Render**

This project was created for **UE606 Software Engineering – Continuous Delivery & Deployment** coursework.

---

## ⭐ Features

### 🎮 Quiz Features

* Multiple sushi questions
* Each question shows an image
* User chooses from multiple-choice answers
* Immediate correct/incorrect feedback
* Score tracking
* Quiz restart option
* Clean UI with static files stored in `/public/images`

### 🧰 Technical Features

* Fully modular Node.js Express backend
* Serving static assets (images, CSS)
* Dockerfile for easy containerization
* GitHub Actions workflow to build & push Docker images
* Multi-tagged images (`latest` + commit SHA)
* Published on **GitHub Container Registry (GHCR)**
* Automatic deployment on Render using Auto-Deploy

---

## 🛠 Technologies Used

| Component       | Technology                       |
| --------------- | -------------------------------- |
| Backend         | Node.js, Express                 |
| Frontend        | HTML, CSS, JS                    |
| Container       | Docker                           |
| CI/CD           | GitHub Actions                   |
| Registry        | GitHub Container Registry (GHCR) |
| Deployment      | Render Web Service               |
| Version Control | Git, GitHub                      |

---

## 📁 Project Structure

```
Sushi_Quiz/
│
├── public/
│   ├── images/          # Sushi quiz images
│   ├── styles.css       # Main CSS file
│   └── script.js        # Frontend JS
│
├── views/
│   └── index.html       # Main quiz page
│
├── index.js             # Express backend
├── package.json
├── Dockerfile
│
└── .github/
    └── workflows/
        └── cd.yml       # Continuous Delivery workflow
```

---

## 🎯 How the Quiz Works

1. User opens the main quiz page
2. A sushi image is displayed
3. User selects one of three answer buttons
4. App checks if it's correct and shows a message
5. Moves to the next sushi
6. At the end, shows score & option to restart

---

# 🐳 Docker Support

Docker allows you to run the quiz **without installing Node.js**.

---

## 📌 Build the image

```bash
docker build -t sushiquiz-app .
```

## 📌 Run the container

```bash
docker run --rm -p 3000:3000 sushiquiz-app
```

App starts at:

```
http://localhost:3000
```

---

# 🐳 Pulling From GHCR (Published Automatically)

This image is published by GitHub Actions.

```bash
docker pull ghcr.io/mustafayevailaha/sushiquiz-app:latest
```

Run it:

```bash
docker run --rm -p 3000:3000 ghcr.io/mustafayevailaha/sushiquiz-app:latest
```

---

# 🔄 CI/CD Pipeline (GitHub Actions → GHCR → Render)

### ✔ Continuous Delivery (cd.yml)

On every **push to main**, GitHub automatically:

1. Builds Docker image
2. Tags it (`latest`, commit SHA)
3. Pushes it to **GHCR**

The workflow is located in:

```
.github/workflows/cd.yml
```

---

# ☁️ Deployment (Render)

Render automatically:

* Detects new commits on the main branch
* Pulls the latest code
* Builds the Docker image
* Deploys the app

This means:

🔄 **Any push → auto-deployment to the cloud**
No manual deployment needed.

---

# 💻 Running Locally (Without Docker)

### Requirements

* Node.js 18+
* npm

### Install & Run

```bash
git clone https://github.com/mustafayevailaha/Sushi_Quiz.git
cd Sushi_Quiz
npm install
npm start
```

App runs at:

```
http://localhost:3000
```

---

# 🖥 OS-Specific Instructions

### ✔ Windows

```
git clone <repo>
npm install
npm start
```

Or use Docker Desktop.

### ✔ Ubuntu / Linux

Make sure Docker is installed:

```bash
sudo apt install docker.io
sudo docker run hello-world
```

Then follow the Docker instructions above.

### ✔ macOS

Install Docker Desktop
or use Homebrew:

```bash
brew install --cask docker
```

Everything else is the same.

---






