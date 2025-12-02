const express = require('express');
const router = express.Router();
const catwayService = require('../services/catway.service');
const reservationService = require('../services/reservation.service');

// 1. Lister tous les catways
router.get('/', async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.status(200).json(catways);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// 2. Récupérer un catway spécifique par son ID (catwayNumber)
router.get('/:id', async (req, res) => {
    try {
        const catway = await catwayService.getCatwayByNumber(req.params.id);
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        res.status(200).json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Créer un catway
router.post('/', async (req, res) => {
    try {
        const newCatway = await catwayService.createCatway(req.body);
        res.status(201).json(newCatway);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
    }
});

// 4. Modifier un catway (partiellement, l'état)
router.put('/:id', async (req, res) => {
    try {
        const updatedCatway = await catwayService.updateCatway(req.params.id, req.body);
        if (!updatedCatway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        res.status(200).json(updatedCatway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. Supprimer un catway
router.delete('/:id', async (req, res) => {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.status(204).send(); // 204 = No Content (succès mais rien à renvoyer)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 6. Liste des réservations d'un catway
router.get('/:id/reservations', async (req, res) => {
    try {
        const reservations = await reservationService.getReservationsByCatway(req.params.id);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 7. Détail d'une réservation spécifique
router.get('/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await reservationService.getReservationById(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 8. Créer une réservation pour un catway
router.post('/:id/reservations', async (req, res) => {
    try {
        const newReservation = await reservationService.createReservation(req.params.id, req.body);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 9. Supprimer une réservation
router.delete('/:id/reservations/:idReservation', async (req, res) => {
    try {
        await reservationService.deleteReservation(req.params.idReservation);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// module.exports = router; (Ne recopie pas cette ligne, elle doit déjà être à la fin de ton fichier)
module.exports = router;