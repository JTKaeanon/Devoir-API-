const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const catwayService = require('../services/catway.service');
const reservationService = require('../services/reservation.service');

// Login
router.get('/', (req, res) => {
    res.render('index', { title: 'Login' });
});

// process Login
router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userService.authenticate(email, password);

        if (user) {
            // cookie 1h
            res.cookie('token', user.name, { maxAge: 3600000, httpOnly: true });
            console.log("Connecté en tant que " + user.name);
            res.redirect('/dashboard');
        } else {
            res.render('index', {
                title: 'Port de Plaisance Russell - Connexion',
                error: 'Email ou mot de passe incorrect'
            });
        }
    } catch (error) {
        console.error(error); // voir erreur dans le terminal
        res.status(500).send('Erreur serveur');
    }
});

// DASHBOARD
router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

/*    CATWAYS */

// Liste des catways
router.get('/catways-page', async (req, res) => {
    try {
        const liste_catways = await catwayService.getAllCatways(); // Changement de nom variable
        res.render('catways', {
            catways: liste_catways,
            title: 'Catways'
        });
    } catch (error) {
        res.status(500).send("Problème récupération catways");
    }
});

// Détail d'un catway
router.get('/catway-detail/:id', async (req, res) => {
    try {
        const monCatway = await catwayService.getCatwayByNumber(req.params.id);
        if (!monCatway) return res.status(404).send("Not found");

        res.render('catway-detail', {
            catway: monCatway,
            title: `Catway ${monCatway.catwayNumber}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

// Update 
router.post('/catway-detail/:id', async (req, res) => {
    try {
        await catwayService.updateCatway(req.params.id, req.body);
        res.redirect('/catways-page');
    } catch (error) {
        console.log("Erreur update");
        res.status(500).send("Update error");
    }
});

// Delete 
router.post('/catway-detail/:id/delete', async (req, res) => {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.redirect('/catways-page');
    } catch (error) {
        res.status(500).send("Impossible de supprimer");
    }
});

// Page formulaire ajout
router.get('/add-catway', (req, res) => {
    res.render('add-catway', { title: 'Ajouter un catway' });
});

// Action ajout
router.post('/add-catway', async (req, res) => {
    try {
        await catwayService.createCatway(req.body);
        res.redirect('/catways-page');
    } catch (error) {
        // errur numéro existe déjà)
        res.render('add-catway', {
            title: 'Ajout Catway',
            error: 'Erreur : Données invalides ou numéro existant'
        });
    }
});

/* RESERVATIONS */

router.get('/reservations-page', async (req, res) => {
    try {
        const allReservations = await reservationService.getAllReservations();
        res.render('reservations', {
            reservations: allReservations,
            title: 'Reservations'
        });
    } catch (error) {
        res.status(500).send("Erreur serveur");
    }
});

router.get('/reservations/delete/:id', async (req, res) => {
    try {
        await reservationService.deleteReservation(req.params.id);
        res.redirect('/reservations-page');
    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur delete");
    }
});

router.get('/add-reservation', async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.render('add-reservation', {
            title: 'Nouvelle Reservation',
            catways: catways
        });
    } catch (error) {
        res.status(500).send("Erreur");
    }
});

// Ajout avec verif dates
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
        console.log("Erreur réservation : " + error.message);

        const list = await catwayService.getAllCatways();

        res.render('add-reservation', {
            title: 'Add Reservation',
            catways: list,
            error: error.message // erreur de doublon
        });
    }
});


/* USERS */

router.get('/users-page', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('users', {
            title: 'Gestion Users',
            users: users
        });
    } catch (error) {
        res.status(500).send("Erreur");
    }
});

router.get('/add-user', (req, res) => {
    res.render('add-user', { title: 'Nouvel utilisateur' });
});

router.post('/add-user', async (req, res) => {
    try {
        await userService.createUser(req.body);
        res.redirect('/users-page');
    } catch (error) {
        res.render('add-user', {
            title: 'Nouvel utilisateur',
            error: 'Erreur création user'
        });
    }
});

router.get('/users/delete/:id', async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.redirect('/users-page');
    } catch (error) {
        res.status(500).send("Erreur");
    }
});

// Documentation
router.get('/api-docs', (req, res) => {
    res.render('api-docs', {
        title: 'Doc API',
        user: res.locals.user
    });
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;