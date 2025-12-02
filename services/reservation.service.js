const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

/**
 * Récupérer toutes les réservations d'un catway spécifique
 */
exports.getReservationsByCatway = async (catwayNumber) => {
    try {
        // On cherche toutes les réservations qui ont ce catwayNumber
        return await Reservation.find({ catwayNumber: catwayNumber });
    } catch (error) {
        throw error;
    }
};

/**
 * Récupérer les détails d'une réservation spécifique
 */
exports.getReservationById = async (idReservation) => {
    try {
        return await Reservation.findById(idReservation);
    } catch (error) {
        throw error;
    }
};

/**
 * Créer une réservation pour un catway
 */
exports.createReservation = async (catwayNumber, reservationData) => {
    try {
        // Vérifier si le catway existe d'abord
        const catway = await Catway.findOne({ catwayNumber: catwayNumber });
        if (!catway) {
            throw new Error('Catway inexistant');
        }

        // On force le numéro du catway dans les données de la réservation
        reservationData.catwayNumber = catwayNumber;

        const reservation = new Reservation(reservationData);
        return await reservation.save();
    } catch (error) {
        throw error;
    }
};

/**
 * Supprimer une réservation
 */
exports.deleteReservation = async (idReservation) => {
    try {
        return await Reservation.findByIdAndDelete(idReservation);
    } catch (error) {
        throw error;
    }
};