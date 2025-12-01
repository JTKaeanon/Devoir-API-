const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatwaySchema = new Schema({
    catwayNumber: {
        type: Number,
        required: [true, 'Le numéro du catway est requis'],
        unique: true // Le brief précise que le numéro doit être unique
    },
    catwayType: {
        type: String,
        enum: ['long', 'short'], // Le brief impose ces deux valeurs
        required: true
    },
    catwayState: {
        type: String, // Description de l'état
        required: true
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('Catway', CatwaySchema);