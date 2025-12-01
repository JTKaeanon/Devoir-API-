require('dotenv').config(); // Important pour récupérer l'URI de la base
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import des modèles
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const connectDB = require('../config/db');

// Connexion à la DB
connectDB();

// Lire les fichiers JSON
const catwaysData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/catways.json'), 'utf-8')
);
const reservationsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/reservations.json'), 'utf-8')
);

// Fonction d'import
const importData = async () => {
    try {
        // Optionnel : On vide la base avant d'importer pour éviter les doublons
        await Catway.deleteMany();
        await Reservation.deleteMany();
        console.log('🗑️  Données existantes supprimées...');

        // Insertion des nouvelles données
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