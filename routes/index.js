const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const catwayService = require('../services/catway.service');
const reservationService = require('../services/reservation.service');

// LOGIN 
router.get('/', (req, res) => {
    res.render('index', { title: 'Login' });
});

// Login processing
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.authenticate(email, password);

        if (user) {
            res.redirect('/dashboard');
        } else {
            res.render('index', { error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// DASHBOARD
router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

// CATWAYS

// Catways list
router.get('/catways-page', async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.render('catways', {
            catways: catways,
            title: 'Catways'
        });
    } catch (error) {
        res.status(500).send("Error fetching catways");
    }
});

// Catway detail
router.get('/catway-detail/:id', async (req, res) => {
    try {
        const catway = await catwayService.getCatwayByNumber(req.params.id);
        if (!catway) return res.status(404).send("Not found");

        res.render('catway-detail', {
            catway: catway,
            title: `Catway ${catway.catwayNumber}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Update a catway
router.post('/catway-detail/:id', async (req, res) => {
    try {
        await catwayService.updateCatway(req.params.id, req.body);
        res.redirect('/catways-page');
    } catch (error) {
        console.error(error);
        res.status(500).send("Update error");
    }
});

// Delete a catway
router.post('/catway-detail/:id/delete', async (req, res) => {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.redirect('/catways-page');
    } catch (error) {
        console.error(error);
        res.status(500).send("Delete error");
    }
});

// Add catway form
router.get('/add-catway', (req, res) => {
    res.render('add-catway', { title: 'Add Catway' });
});

// Process add catway
router.post('/add-catway', async (req, res) => {
    try {
        await catwayService.createCatway(req.body);
        res.redirect('/catways-page');
    } catch (error) {
        console.error(error);
        res.render('add-catway', {
            title: 'Add Catway',
            error: 'Duplicate or invalid data'
        });
    }
});

//  RESERVATIONS 

// Reservations list
router.get('/reservations-page', async (req, res) => {
    try {
        const reservations = await reservationService.getAllReservations();
        res.render('reservations', {
            reservations: reservations,
            title: 'Reservations'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Delete reservation
router.get('/reservations/delete/:id', async (req, res) => {
    try {
        await reservationService.deleteReservation(req.params.id);
        res.redirect('/reservations-page');
    } catch (error) {
        console.error(error);
        res.status(500).send("Delete error");
    }
});

// Add reservation form
router.get('/add-reservation', async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.render('add-reservation', { 
            title: 'Add Reservation',
            catways: catways 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Process add reservation
router.post('/add-reservation', async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

        await reservationService.createReservation(catwayNumber, {
            clientName,
            boatName,
            startDate,
            endDate
        });

        res.redirect('/reservations-page');
    } catch (error) {
        console.error(error);
        
        const catways = await catwayService.getAllCatways();

        res.render('add-reservation', { 
            title: 'Add Reservation',
            catways: catways,
            error: 'Already reserved'
        });
    }
});


module.exports = router;
