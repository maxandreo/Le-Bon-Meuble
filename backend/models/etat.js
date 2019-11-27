const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EtatSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  nom: { type: String, required: true },
}, {collection: 'etats'});

const Etat = mongoose.model('etat', EtatSchema);


module.exports = Etat;
