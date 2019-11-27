const express = require('express');

const mongoose = require('mongoose');

// AIzaSyC5sIMFkWbde-Y1muILoVXgVL1RdQb15-s
// Create client with a Promise constructor
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAXBYMt0VMojBLnKEUyX1oB32Twb6eSKWo',
  Promise: Promise
});

const Annonce = require('../models/annonce');
const Categorie = require('../models/categorie');
const Materiau = require('../models/materiau');
const Etat = require('../models/etat');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const verifyToken = require("../middleware/verify-token");
const extractFile = require('../middleware/file');

const router = express.Router();

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'abcd-should-be-longuer');
    req.userData = {
      email: decodedToken.email,
      idUser: decodedToken.idUser,
      nomUser: decodedToken.nomUser,
      token: token
    };
    next();
  } catch (error) {
    res.status(403).json({ message: "Vous n'êtes pas authentifié" });
  }
}

// Create add
router.post('/annonce', verifyToken, extractFile, (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  jwt.verify(req.userData.token, 'abcd-should-be-longuer', err => {
    if (err) {
      res.status(403).json({ message: `Le token n'est pas valide` });
    } else {
      Categorie.findById(req.body.categorie).then(categorie => {
        if (!categorie) {
          return res.status(404).json({
            message: 'Categorie not found'
          });
        }
        Materiau.findById(req.body.materiau).then(materiau => {
          if (!materiau) {
            return res.status(404).json({
              message: 'Materiau not found'
            });
          }
          Etat.findById(req.body.etat).then(etat => {
            if (!etat) {
              return res.status(404).json({
                message: 'Etat not found'
              });
            }

            // Geocode an address with a promise
            // let adressNum = req.body.adressNum;
            // let adressChemin = req.body.adressChemin;
            let adress = req.body.adress;
            let adressVille = req.body.adressVille;
            googleMapsClient
              .geocode({
                address: adress + ',' + adressVille
              })
              .asPromise()
              .then(geoloc => {
                console.log('geolocation ok :', geoloc.json.results);
                Annonce.create({
                  _id: mongoose.Types.ObjectId(),
                  idUser: req.userData.idUser, //userData venant du middleware verifyToken
                  nomUser: req.userData.nomUser, //userData venant du middleware verifyToken
                  image: req.file ? url + '/images/' + req.file.filename : '',
                  categorie: categorie.nom,
                  idCat: req.body.categorie,
                  titre: req.body.titre,
                  description: req.body.description,
                  etat: etat.nom,
                  idEtat: req.body.etat,
                  materiau: materiau.nom,
                  idMat: req.body.materiau,
                  hauteur: req.body.hauteur,
                  largeur: req.body.largeur,
                  profondeur: req.body.profondeur,
                  okEnvoi: req.body.okEnvoi,
                  okRetraitdomicile: req.body.okRetraitdomicile,
                  quantite: req.body.quantite,
                  prix: req.body.prix,
                  createdAt: req.body.createdAt,
                  lat: geoloc.json.results[0].geometry.location.lat,
                  lng: geoloc.json.results[0].geometry.location.lng
                })
                  .then(annonceCreated => {
                    // console.log('annonce crée ! : ', annonceCreated);
                    res.status(201).json({
                      geoloc: geoloc.json.results,
                      annonceCreated: annonceCreated,
                      annonceurData: req.userData //userData venant du middleware verifyToken
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      message: "La création de l'annonce a échouée"
                    });
                  });
              })
              .catch(err => {
                console.log('geolocation error', err);
              });
          });
        });
      });
    }
  });
});

// Get all categories
router.get('/categories', (req, res, next) => {
  Categorie.find().then(categories => {
    res.json(categories);
  });
});

// Get all etats
router.get('/etats', (req, res, next) => {
  Etat.find().then(etats => {
    res.json(etats);
  });
});

// Get all materiaux
router.get('/materiaux', (req, res, next) => {
  Materiau.find().then(materiaux => {
    res.json(materiaux);
  });
});

// Get annonces d'un user pour son profil
router.get('/userAnnonce/:id', (req, res, next) => {
  jwt.verify(req.userData.token, 'secret-should-be_longuer', err => {
    if (err) {
      res.status(403).json({ message: `Le token n'est pas valide` });
    } else {
      Annonce.find({ idUser: req.params.id })
        .then(annonces => {
          res.json(annonces);
        })
        .catch(err => console.log('erruer'));
    }
  });
});

//Delete ad
router.delete('/annonce/:id', (req, res, next) => {
  // jwt.verify(req.userData.token, 'secret-should-be_longuer', err => {
  //   if (err) {
  //     res.status(403).json({ message: `Le token n'est pas valide` });
  //   } else {

  Annonce.deleteOne(req.params._id)
    .then(annonce => {
      res.json(annonce);
    })
    .catch(err => console.log('erruer'));
  //   }
  // });
});

//Update ad
router.put('/annonce/:id', verifyToken, (req, res, next) => {
  jwt.verify(req.userData.token, 'secret-should-be_longuer', err => {
    if (err) {
      res.status(403).json({ message: `Le token n'est pas valide` });
    } else {
      Annonce.updateOne({ _id: req.params.id }, req.body).then(annonce => {
        res.json(annonce);
      });
    }
  });
});

// Get all ads avec Geoloc ou sans
router.get('/annonces', (req, res, next) => {
  Annonce.find({})
    .then(annonces => {
      res.json(annonces);
    })
    .catch(next);
});

// router.get('/annonces', (req, res, next) => {
//   if (!req.query.lng || req.query.lat) {
//   Annonce.find({})
//     .then(annonces => {
//       res.json(annonces);
//     })
//     .catch(next);
//   }
//   let lng = parseFloat(req.query.lng);
//   let lat = parseFloat(req.query.lat);
//   Annonce.aggregate([
//     {
//       $geoNear: {
//         near: { type: "Point", coordinates: [lng, lat] },
//         distanceField: "dist.calculated",
//         maxDistance: 100000,
//         includeLocs: "dist.location",
//         spherical: true
//       }
//     }
//   ])
//     .then(annonces => {
//       res.json(annonces);
//     })
//     .catch(next);
// });

module.exports = router;
