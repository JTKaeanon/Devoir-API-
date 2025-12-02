const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser'); // 1. IMPORT ICI (en haut)

// Import des routes
const catwaysRoutes = require('./routes/catways.routes');
const usersRoutes = require('./routes/users.routes');
const indexRoutes = require('./routes/index'); 

dotenv.config();

// Connexion à la Base de Données
connectDB();

const app = express();

// Configuration du moteur de vue EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- MIDDLEWARES (L'ORDRE EST CRUCIAL ICI) ---
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. ACTIVATION DE COOKIE PARSER (AVANT de l'utiliser)
app.use(cookieParser()); 

// 3. MIDDLEWARE UTILISATEUR (Placé APRES cookie-parser)
app.use((req, res, next) => {
    // Petit log pour vérifier dans la console si ça marche
    // console.log("🍪 Cookie détecté :", req.cookies.token); 

    if (req.cookies && req.cookies.token) {
        res.locals.user = req.cookies.token;
    } else {
        res.locals.user = null;
    }
    next();
});

// --- DÉCLARATION DES ROUTES (EN DERNIER) ---
app.use('/catways', catwaysRoutes);
app.use('/users', usersRoutes);
app.use('/', indexRoutes); // La route d'accueil en dernier

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});