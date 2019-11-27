const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

const app = express();

// Connect mongodb
mongoose
  .connect('mongodb://localhost/athome', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Failed to connect database');
  });
mongoose.Promise = global.Promise;

// Cors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// rendre le dossier images accessible de manière statique
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});


// routes
app.use('/api', require('./routes/annonceApi'));
app.use('/api', require('./routes/userApi'));

// error handling middleware
app.use((err, req, res, next) => {
  // console.log(err);
  res.status(422).json({ error: err.message });
});

module.exports = app;
