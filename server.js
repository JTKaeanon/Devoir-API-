const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connexion à la DB
connectDB();

// Middleware pour traiter les données JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test simple
app.get('/', (req, res) => {
    res.send('API Catways est en ligne !');
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});