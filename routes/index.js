const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const catwayService = require('../services/catway.service');
const reservationService = require('../services/reservation.service');

// --- ROUTE LOGIN (Page d'accueil) ---
router.get('/', (req, res) => {
    res.render('index', { title: 'Port de Plaisance Russell - Connexion ' });
});

// Traitement du Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.authenticate(email, password);

        if (user) {
            res.redirect('/dashboard');
        } else {
            res.render('index', { error: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

// --- ROUTE DASHBOARD ---
router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Tableau de bord - Russell' });
});

// --- ROUTES CATWAYS ---

// Liste des catways
router.get('/catways-page', async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.render('catways', {
            catways: catways,
            title: 'Liste des Catways'
        });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des catways");
    }
});

// Détail d'un catway (Affichage)
router.get('/catway-detail/:id', async (req, res) => {
    try {
        const catway = await catwayService.getCatwayByNumber(req.params.id);
        if (!catway) return res.status(404).send("Introuvable");

        res.render('catway-detail', {
            catway: catway,
            title: `Catway n°${catway.catwayNumber} - Détails`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// Modifier un catway
router.post('/catway-detail/:id', async (req, res) => {
    try {
        await catwayService.updateCatway(req.params.id, req.body);
        res.redirect('/catways-page');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour");
    }
});

// Supprimer un catway
router.post('/catway-detail/:id/delete', async (req, res) => {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.redirect('/catways-page');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression");
    }
});

// Formulaire d'ajout de catway (GET)
router.get('/add-catway', (req, res) => {
    res.render('add-catway', { title: 'Ajouter un catway' });
});

// Traitement de l'ajout de catway (POST)
router.post('/add-catway', async (req, res) => {
    try {
        await catwayService.createCatway(req.body);
        res.redirect('/catways-page');
    } catch (error) {
        console.error(error);
        res.render('add-catway', {
            title: 'Ajouter un catway',
            error: 'Erreur : Le numéro existe peut-être déjà ou les données sont invalides.'
        });
    }
});

// --- ROUTES RÉSERVATIONS ---

// Liste des réservations
router.get('/reservations-page', async (req, res) => {
    try {
        const reservations = await reservationService.getAllReservations();
        res.render('reservations', {
            reservations: reservations,
            title: 'Liste des Réservations'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// Supprimer une réservation
router.get('/reservations/delete/:id', async (req, res) => {
    try {
        await reservationService.deleteReservation(req.params.id);
        res.redirect('/reservations-page');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur suppression");
    }
});

// Formulaire d'ajout de réservation (GET)
router.get('/add-reservation', async (req, res) => {
    try {
        const catways = await catwayService.getAllCatways();
        res.render('add-reservation', { 
            title: 'Nouvelle Réservation',
            catways: catways 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// Traitement de l'ajout de réservation (POST) - VERSION CORRIGÉE
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
        
        // En cas d'erreur (doublon), on recharge la liste pour réafficher le formulaire
        const catways = await catwayService.getAllCatways();

        res.render('add-reservation', { 
            title: 'Nouvelle Réservation',
            catways: catways,
            error: error.message // Affiche le message "Impossible : Le catway est déjà réservé..."
        });
    }
});

// CETTE LIGNE DOIT TOUJOURS ÊTRE À LA FIN
module.exports = router;