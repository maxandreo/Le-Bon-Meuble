const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnonceSchema = new Schema({
  idUser: {
    type: String
  },
  image: {
    type: String
  },
  nomUser: {
    type: String
  },
  categorie: {
    type: String,
    ref: 'Categorie'
    // required: true
  },
  idCat: {
    type: String,
    ref: 'Categorie'
    // required: true
  },
  titre: {
    type: String
    // required: true
  },
  description: {
    type: String
    // required: true
  },
  etat: {
    type: String,
    ref: 'Etat'
    // required: true
  },
  idEtat: {
    type: String,
    ref: 'Etat'
    // required: true
  },
  materiau: {
    type: String,
    ref: 'Materiau'
    // required: true
  },
  idMat: {
    type: String,
    ref: 'Materiau'
    // required: true
  },
  hauteur: {
    type: Number
    // required: true
  },
  largeur: {
    type: Number
    // required: true
  },
  profondeur: {
    type: Number
    // required: true
  },
  okEnvoi: {
    type: Boolean
  },
  okRetraitdomicile: {
    type: Boolean
    // default: true
  },
  quantite: {
    type: Number,
    default: 1
    // required: true
  },
  prix: {
    type: Number
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // add in geo location
  lat: {
    type: Number
  },
  lng: {
    type: Number
  }
});

const Annonce = mongoose.model('annonce', AnnonceSchema);

module.exports = Annonce;
