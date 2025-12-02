const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatwaySchema = new Schema({
    catwayNumber: {
        type: Number,
        required: [true, 'Le numéro du catway est requis'],
        unique: true 
    },
    catwayType: {
        type: String,
        required: [true, 'Le type de catway est requis'],
        enum: {
            values: ['long', 'short'],
            message: 'Le type doit être soit "long", soit "short"'
        }
    },
    catwayState: {
        type: String,
        required: [true, 'La description de l\'état est requise']
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Catway', CatwaySchema);