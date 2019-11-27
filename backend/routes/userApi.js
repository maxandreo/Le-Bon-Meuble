const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create client with a Promise constructor
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAXBYMt0VMojBLnKEUyX1oB32Twb6eSKWo',
  Promise: Promise
});
const User = require('../models/user');

process.env.SECRET_KEY = 'secret-should-be_longuer';

//create a user
router.post('/signup', (req, res, next) => {
  const userData = {
    _id: mongoose.Types.ObjectId(),
    nomUser: req.body.nomUser,
    email: req.body.email,
    password: req.body.password,
    lat: '',
    lng: ''
  };
  User.findOne({
    //check if user exist and crypt password
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          // console.log('password:' + userData.password);
          let adressVille = req.body.ville;
          googleMapsClient
            .geocode({
              address: adressVille
            })
            .asPromise()
            .then(geoloc => {
              console.log('geolocation ok :', geoloc.json.results);
              userData.lat = geoloc.json.results[0].geometry.location.lat;
              userData.lng = geoloc.json.results[0].geometry.location.lng;
              User.create(userData)
                .then(user => {
                  res.json(user);
                  console.log('User created' + user);
                })
                .catch(err => {
                  console.log('Création User failed : ' + err);
                });
            });
        });
      } else {
        res.json({ error: 'User already exists' });
      }
    })
    .catch(err => next(err));
});

//log a user
router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        fetchedUser = user;
        //compare password typed with password recorded in db
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            idUser: fetchedUser._id,
            nomUser: fetchedUser.nomUser,
            email: fetchedUser.email
          };
          //create token if password matches
          const token = jwt.sign(payload, 'abcd-should-be-longuer', {
            expiresIn: '1h'
          });
          res.json({
            token: token,
            expiresIn: 3600,
            nomUser: fetchedUser.nomUser,
            idUser: fetchedUser._id,
            lat: fetchedUser.lat,
            lng: fetchedUser.lng
          });
          console.log('User Logged :' + fetchedUser.nomUser);
        } else {
          res.json({ error: 'Password is not correct' });
        }
      } else {
        res.json({ error: 'User does not exist' });
      }
    })
    .catch(err => next(err));
});

//////////////// A FAIRE /////////////////////////////

//update a user's data
router.put('/user/:id', (req, res, next) => {
  // Find the user we want to update with his ID
  User.findById({ _id: req.params.id })
    .then(user => {
      user.lastName = req.body.lastName;
      user.firstName = req.body.firstName;
      //if password changed
      if (req.body.password) {
        user.password = bcrypt.hash(req.body.password, 10, (err, hash) => {
          user.password = hash;
          console.log('password:' + user.password);
          user.save(user => {
            res.json(user);
          });
        });
      } else {
        user.save(user => {
          res.json(user);
        });
      }
    })
    .catch(err => next(err));
});

//get all users
router.get('/user', (req, res, next) => {
  User.find()
    .then(user => {
      res.json(user);
    })
    .catch(err => next(err));
});

//get user by id
router.get('/user/:id', (req, res, next) => {
  // use our user model to find the user we want
  User.findById({ _id: req.params.id })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      next(err);
    });
});

// delete a user with his id
router.delete('/user/:id', (req, res, next) => {
  User.findByIdAndDelete({ _id: req.params.id })
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
