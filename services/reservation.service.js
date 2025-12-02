const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

/**
 * Récupérer toutes les réservations d'un catway spécifique
 */
exports.getReservationsByCatway = async (catwayNumber) => {
    try {
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
        const catway = await Catway.findOne({ catwayNumber: catwayNumber });
        if (!catway) {
            throw new Error('Catway inexistant');
        }

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

/**
 * Récupérer toutes les réservations
 */

exports.getAllReservations = async () => {
    try {
        // .sort({ startDate: 1 }) trie par date croissante (du plus vieux au plus récent)
        // .sort({ startDate: -1 }) trierait par date décroissante (le plus récent en haut)
        return await Reservation.find().sort({ startDate: 1 });
    } catch (error) {
        throw error;
    }
};


/**
 * Créer une réservation (AVEC vérification de doublon)
 */
exports.createReservation = async (catwayNumber, reservationData) => {
    try {
        // 1. Vérifier si le catway existe
        const catway = await Catway.findOne({ catwayNumber: catwayNumber });
        if (!catway) throw new Error('Catway inexistant');

        // 2. Conversion des dates d'entrée en objets Date javascript
        const newStart = new Date(reservationData.startDate);
        const newEnd = new Date(reservationData.endDate);

        // Vérification basique : la fin doit être après le début
        if (newStart > newEnd) {
            throw new Error('La date de fin doit être après la date de début');
        }

        // 3. Récupérer les réservations existantes sur CE catway
        const existingReservations = await Reservation.find({ catwayNumber: catwayNumber });

        // 4. Boucle pour vérifier les chevauchements
        for (const existing of existingReservations) {
            const start = new Date(existing.startDate);
            const end = new Date(existing.endDate);

            // LOGIQUE DE CHEVAUCHEMENT :
            // Si (NouveauDébut <= AncienFin) ET (NouvelleFin >= AncienDébut)
            // Alors les périodes se touchent ou se superposent
            if (newStart <= end && newEnd >= start) {
                throw new Error(`Impossible : Le catway est déjà réservé du ${start.toLocaleDateString()} au ${end.toLocaleDateString()}`);
            }
        }

        // 5. Si tout est bon, on enregistre
        reservationData.catwayNumber = catwayNumber;
        const reservation = new Reservation(reservationData);
        return await reservation.save();

    } catch (error) {
        throw error;
    }
};
