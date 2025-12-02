const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

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
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

// Middleware pour traiter les données
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DÉCLARATION DES ROUTES ---
// Les routes spécifiques (API)
app.use('/catways', catwaysRoutes);
app.use('/users', usersRoutes);

// Middleware pour rendre le nom de l'utilisateur disponible dans toutes les vues EJS
app.use((req, res, next) => {
    // Si le cookie existe, on le met dans une variable locale 'user'
    if (req.cookies && req.cookies.token) {
        res.locals.user = req.cookies.token;
    } else {
        res.locals.user = null;
    }
    next();
});


// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

const cookieParser = require('cookie-parser'); // Import
// ...
app.use(cookieParser()); // Utilisation (Avant les routes)
app.use(express.json());



// La route pour l'accueil et le login (doit être en dernier généralement)
app.use('/', indexRoutes); 