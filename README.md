# Dine Divine

Welcome to **Dine Divine**, a full-stack web application that brings the delicious experience of dining right to your fingertips. This project features a beautifully designed frontend for exploring the menu, placing orders, and managing a shopping cart, along with a backend to support core functionalities.

---

## Project Overview

Dine Divine is an online food ordering platform designed for users to browse a diverse menu, add items to their cart, and place orders effortlessly. The site emphasizes user experience with a clean, visually appealing design and intuitive navigation.

### Key Features

- **Responsive User Interface:**  
  A modern, clean UI with sections like Home, Menu, Offers, and Contact for seamless navigation.

- **Dynamic Menu Display:**  
  Users can explore a variety of food items including burgers, pizzas, wraps, milkshakes, beverages, and desserts with detailed descriptions and prices.

- **Shopping Cart Sidebar:**  
  A sidebar cart dynamically updates as users add or remove items, showing total items and cost in real-time.

- **Special Offers:**  
  Highlighted deals and discounts to attract users to popular combos and discounted items.

- **User Authentication:**  
  Login and logout functionality to personalize the user experience.

- **Order Management:**  
  Users can clear their cart or proceed to place an order directly from the cart sidebar.

- **Review System:**  
  Users can leave reviews to share their experience and feedback.

- **Contact Information:**  
  Easy access to contact details for customer support.

---

## Tech Stack

- **Frontend:**  
  - HTML5, CSS3 (with Google Fonts & FontAwesome icons)  
  - JavaScript for interactivity and cart management  

- **Backend:**  
  - Node.js (server.js) for handling backend logic and APIs  
  - Environment variables managed via `.env` file  

- **Package Management:**  
  - npm with dependencies listed in `package.json` and `package-lock.json`  

---

## Project Structure

```
/backend
├── server.js                 # Main backend server file
├── .env                      # Environment variables (e.g. port, database URI)
├── package.json              # Backend dependencies and scripts
└── package-lock.json         # Auto-generated npm lock file

/frontend
├── *.html                    # HTML files for UI pages (order.html, login.html, etc.)
├── *.css                     # CSS stylesheets for different pages
├── *.js                      # Frontend JavaScript files (order.js)
├── images/                   # Images used in the site (burger.jpg, COKE.png, etc.)
├── package.json              # Frontend dependencies (if any)
└── package-lock.json
```

---

## How to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dinedivine.git
   cd dinedivine/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the backend folder with necessary variables like:
   ```ini
   PORT=3000
   DB_URI=your_database_connection_string
   ```

4. **Start the backend server**
   ```bash
   node server.js
   ```

5. **Open the frontend**
   
   Open any of the HTML files inside the `/frontend` folder in your browser (e.g., `order.html`).
