const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const catwayService = require('../services/catway.service');

// Route pour afficher la page d'accueil (Login)
router.get('/', (req, res) => {
    res.render('index', { title: 'Port de Plaisance Russell - Connexion ' });
});


// Route pour traiter le Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // On utilise le service créé précédemment pour vérifier
        const user = await userService.authenticate(email, password);

        if (user) {
            // Si c'est bon, on redirige vers le tableau de bord
            // (On créera cette page à la prochaine étape)
            res.redirect('/dashboard');
        } else {
            // Si mauvais mot de passe
            res.render('index', { error: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

// Dashboard route
router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Tableau de bord - Russell' });
});


// Liste catways
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

// détail catway
// 1. AFFICHER (GET)
// On change '/catways/:id' en '/catway-detail/:id'
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

// 2. MODIFIER (POST)
router.post('/catway-detail/:id', async (req, res) => {
    try {
        await catwayService.updateCatway(req.params.id, req.body);
        res.redirect('/catways-page'); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour");
    }
});

// 3. SUPPRIMER (POST)
router.post('/catway-detail/:id/delete', async (req, res) => {
    try {
        await catwayService.deleteCatway(req.params.id);
        res.redirect('/catways-page'); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression");
    }
});


// Formulaire de création (GET)
router.get('/add-catway', (req, res) => {
    res.render('add-catway', { title: 'Ajouter un catway' });
});

// Traitement du formulaire (POST)
router.post('/add-catway', async (req, res) => {
    try {
        await catwayService.createCatway(req.body);
        res.redirect('/catways-page'); // Succès : retour à la liste
    } catch (error) {
        console.error(error);
        // En cas d'erreur (ex: numéro déjà pris), on réaffiche le formulaire avec un message
        res.render('add-catway', { 
            title: 'Ajouter un catway',
            error: 'Erreur : Le numéro existe peut-être déjà ou les données sont invalides.'
        });
    }
});


module.exports = router;