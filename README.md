# Grocery Management System 🛒

A modern, visually stunning **Web-based Grocery Management System** built with **React (Vite + Shadcn UI)** for the frontend and **Python (Flask)** for the backend REST API.  
This project helps manage grocery items, inventory, and billing from two perspectives: **Admin** and **Customer**.

> **Note:** This complete architectural migration from a CLI app to a beautiful React Web App successfully resolves **[Issue #20: Migrate from the command-line interface to a modern web or desktop GUI](https://github.com/vanshika114/grocery-management-system/issues/20)**!

---

## Features

### 👨‍💼 Admin
Admins can perform the following operations:
1. Add a new product
2. Update the price of an existing product
3. Update the quantity of an existing product
4. Delete a product

---

### 🧑‍💻 Customer
Customers can:
1. Browse available products
2. Add items to the cart
3. Delete items from the cart
4. Update item quantity in the cart
5. View the total price and checkout

---

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI
- **3D & Animations**: `@react-three/fiber`, `@react-three/drei`, `react-parallax-tilt`
- **UI Elements**: Animated buttons from Uiverse.io (`rude-bear-14` by Adam Giebl)
- **Backend**: Python 3, Flask, Flask-CORS
- **Database**: JSON for local data persistence

---

## How to Run the Project

Since the application is built with a decoupled architecture, you need to run **two** separate servers: the Flask API and the React Development Server.

### 1. Start the Flask Backend API

1. Clone the repository:
   ```bash
   git clone https://github.com/vanshika114/grocery-management-system.git
   cd grocery-management-system
   ```

2. Set up the Python virtual environment and install dependencies:
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On Mac/Linux
   source venv/bin/activate
   
   pip install Flask flask-cors
   ```

3. Run the Flask API server:
   ```bash
   python app.py
   ```
   *(The API will run on `http://127.0.0.1:5000`)*

---

### 2. Start the React Frontend

Open a **new terminal window/tab**, and navigate to the frontend directory:

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173/` or `http://localhost:5174/`).
