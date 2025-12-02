const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

// Route pour afficher la page d'accueil (Login)
router.get('/', (req, res) => {
    res.render('index');
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

// Route pour le tableau de bord
router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

module.exports = router;