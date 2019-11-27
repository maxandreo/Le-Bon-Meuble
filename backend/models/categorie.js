const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategorieSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  nom: { type: String, required: true },
}, {collection: 'categories'});

const Categorie = mongoose.model('categorie', CategorieSchema);


module.exports = Categorie;
