// include Express
const express = require('express');

// create instance of Express app
const app = express();

// include .env file for credentials
require('dotenv').config();

// server will listen on this port
const port = 3000;

// manage database connectivity
require('./models/mongoose');

// reference test json file of users
const data = require('./test.json');

// middleware and config
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// load routes AFTER app is created
const recipeRoutes = require('./routes/recipes');
app.use('/recipes', recipeRoutes);

// index/home URL
app.get('/', (req, res) => {
  res.render('pages/index', { title: 'Home Page' });
});

// about URL
app.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About Page' });
});

// users route
app.get('/users', (req, res) => {
  res.render('users/index', {
    title: 'Users Page',
    users: data
  });
});

// view user by index (id-1)
app.get('/users/view/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.render('users/view', {
    title: 'User Page',
    user: data[id - 1] // safer than using --
  });
});

// set server to listen for requests
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
