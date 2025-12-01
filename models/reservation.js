const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    catwayNumber: {
        type: Number,
        required: [true, 'Le numéro du catway est requis']
    },
    clientName: {
        type: String,
        required: [true, 'Le nom du client est requis']
    },
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis']
    },
    startDate: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', ReservationSchema);