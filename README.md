# UrbanShop - The eCommerce App <img src="https://www.pngmart.com/files/11/E-Commerce-PNG-Transparent.png" height="45px" width = "45px"/>
eCommerce platform built with the MERN stack & Redux.

[![Mongo Badge](http://img.shields.io/badge/Database%20-MongoDB-darkgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
&emsp;
[![Express Badge](http://img.shields.io/badge/Server%20-Express-black?style=for-the-badge&logo=express)](https://expressjs.com/)
&emsp;
[![Reactjs Badge](http://img.shields.io/badge/Client%20-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
&emsp;
[![Node Badge](http://img.shields.io/badge/Backend%20-Node-green?style=for-the-badge&logo=node.js)](https://nodejs.org/en/)
&emsp;
  
 
![urbanshop](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/assets/95426993/75326a9d-718c-4844-839f-1e787056f35d)



This project is part of my MERN Stack From Scratch | The eCommerce Platform. It is a full-featured shopping cart with PayPal & credit/debit payments.
This is version of the app uses Redux Toolkit for state management, 'react-bootstrap' is used for the Bootstrap theme, and mongoose is used for creating the data models.


[![Redux Badge](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Mongoose Badge](https://img.shields.io/badge/Mongoose-800?logo=mongoose&logoColor=fff&style=for-the-badge)](https://mongoosejs.com/)




## Contents
* [Features](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/tree/main#features)
* [Usage](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/tree/main#usage)
  * [Env Variables](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/tree/main#env-variables)
  * [Install Dependencies (frontend & backend)](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/tree/main#install-dependencies-frontend--backend)
  * [Run](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/tree/main#run)
* [Build & Deploy](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/tree/main#build--deploy)
* [Seed Database](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/tree/main#seed-database)
* [Work in Progress](https://github.com/umangutkarsh/UrbanShop-The_eCommerce_app/tree/main#work-in-progress)



## Features
* 🛒 Full featured shopping cart
* ⭐ Product reviews and ratings
* 📱 Top products carousel
* 🗐 Product pagination
* 🔍 Product search feature
* 📤 User profile with orders
* 📦 Admin product management
* 👤 Admin user management
* 🧾 Admin Order details page
* 📬 Mark orders as delivered option
* 🛍️ Checkout process (shipping, payment method, etc)
* 💳 PayPal / credit card integration
* 📊 Database seeder (products & users)



## Usage
* Create a MongoDB database and obtain your MongoDB URI - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
* Create a PayPal account and obtain your Client ID - [PayPal Developer](https://developer.paypal.com/home)

### Env Variables
Rename the .env.example file to .env and add the following
```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
MONGO_COMPASS = your_mongo_compass
JWT_SECRET = 'your scret key'
PAYPAL_CLIENT_ID = your paypal client id
PAGINATION_LIMIT = 8
```
Change the JWT_SECRET and PAGINATION_LIMIT to what you want

### Install Dependencies (frontend & backend)
```
npm install
cd frontend
npm install
```

### Run
```
# Run frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```


## Build & Deploy
```
# Create frontend prod build
cd frontend
npm run build
```


## Seed Database
Use the following commands to seed the database with some sample users and products as well as destroy all data
```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```
```
Sample User Logins

admin@email.com (Admin)
password

batman@email.com (Customer)
password

steve2@email.com (Customer)
steverogers
```


## Work in Progress
Some minor bug fixes in the frontend and backend

