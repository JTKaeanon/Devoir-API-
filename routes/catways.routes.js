const express = require('express');
const router = express.Router();
const catwayService = require('../services/catway.service');
const reservationService = require('../services/reservation.service.js');

// List  catways
router.get('/', async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.status(200).json(catways);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// catway by ID
router.get('/:id', async (req, res) => {
    try {
        const catway = await catwayService.getCatwayByNumber(req.params.id);
        if (!catway) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create catway
router.post('/', async (req, res) => {
    try {
        const newCatway = await catwayService.createCatway(req.body);
        res.status(201).json(newCatway);
    } catch (error) {
        res.status(400).json({ message: 'Creation error', error: error.message });
    }
});

// Update catway
router.put('/:id', async (req, res) => {
    try {
        const updatedCatway = await catwayService.updateCatway(req.params.id, req.body);
        if (!updatedCatway) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json(updatedCatway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete catway
router.delete('/:id', async (req, res) => {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// List reservations 
router.get('/:id/reservations', async (req, res) => {
    try {
        const reservations = await reservationService.getReservationsByCatway(req.params.id);
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// reservation by ID
router.get('/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await reservationService.getReservationById(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create reservation 
router.post('/:id/reservations', async (req, res) => {
    try {
        const newReservation = await reservationService.createReservation(req.params.id, req.body);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//  Delete reservation
router.delete('/:id/reservations/:idReservation', async (req, res) => {
    try {
        await reservationService.deleteReservation(req.params.idReservation);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
