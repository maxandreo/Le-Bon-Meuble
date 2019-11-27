const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MateriauSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  nom: { type: String, required: true },
}, {collection: 'materiaus'});

const Materiau = mongoose.model('materiau', MateriauSchema);


module.exports = Materiau;
