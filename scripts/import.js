require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import  modèles
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const connectDB = require('../config/db');

// Connexion  DB
connectDB();

// read  fichiers JSON
const catwaysData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/catways.json'), 'utf-8')
);
const reservationsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/reservations.json'), 'utf-8')
);

// import
const importData = async () => {
    try {
        // await Catway.deleteMany();
        // wait Reservation.deleteMany();
        // console.log(' Données existantes supprimées...');

        await Catway.create(catwaysData);
        await Reservation.create(reservationsData);

        console.log('✅ Données importées avec succès !');
        process.exit();
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation :', error);
        process.exit(1);
    }
};

// Lancer l'import
importData();