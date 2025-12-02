require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const connectDB = require('../config/db');

connectDB();

const createAdmin = async () => {
    try {
        // Supprime les users existants pour éviter les doublons de test
        await User.deleteMany({ email: 'admin@catways.com' });

        const admin = new User({
            name: 'Capitaine',
            email: 'admin@catways.com',
            password: 'password123' // Sera hashé automatiquement
        });

        await admin.save();
        console.log('✅ Utilisateur Admin créé : admin@catways.com / password123');
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
};

createAdmin();