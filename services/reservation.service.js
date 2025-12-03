const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

exports.getReservationsByCatway = async (catwayNumber) => {
    try {
        return await Reservation.find({ catwayNumber: catwayNumber });
    } catch (error) {
        throw error;
    }
};

exports.getReservationById = async (idReservation) => {
    try {
        return await Reservation.findById(idReservation);
    } catch (error) {
        throw error;
    }
};

/**
*récupérer (trié par date) */
exports.getAllReservations = async () => {
    try {
        /**
*plus vieux au plus récent*/
        return await Reservation.find().sort({ startDate: 1 });
    } catch (error) {
        throw error;
    }
};

exports.deleteReservation = async (idReservation) => {
    try {
        return await Reservation.findByIdAndDelete(idReservation);
    } catch (error) {
        throw error;
    }
};

/** vérification de chevauchement  */
exports.createReservation = async (catwayNumber, reservationData) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: catwayNumber });
        if (!catway) throw new Error('Catway inexistant');

        const debut = new Date(reservationData.startDate);
        const fin = new Date(reservationData.endDate);

        if (debut > fin) {
            throw new Error('La date de fin doit être après le début');
        }

        const existing = await Reservation.find({ catwayNumber: catwayNumber });

        for (const resa of existing) {
            const date_debut_existante = new Date(resa.startDate);
            const date_fin_existante = new Date(resa.endDate);

            /**  
             * Logique de chevauchement :
             *nouveau début AVANT la fin existante
             *ET nouvelle fin  APRÈS le début existant
             *Pas possible 
             */
            if (debut <= date_fin_existante && fin >= date_debut_existante) {

                throw new Error(`Impossible : Le catway est déjà pris du ${date_debut_existante.toLocaleDateString()} au ${date_fin_existante.toLocaleDateString()}`);
            }
        }

        reservationData.catwayNumber = catwayNumber;
        const reservation = new Reservation(reservationData);
        return await reservation.save();

    } catch (error) {
        throw error;
    }
};