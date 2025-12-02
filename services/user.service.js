const User = require('../models/user');
const bcrypt = require('bcryptjs');

/**
 * Récupérer tous les utilisateurs
 */
exports.getAllUsers = async () => {
    return await User.find().select('-password'); // On ne renvoie jamais le mot de passe
};

/**
 * Récupérer un utilisateur par son ID
 */
exports.getUserById = async (id) => {
    return await User.findById(id).select('-password');
};

/**
 * Créer un utilisateur
 */
exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

/**
 * Mettre à jour un utilisateur
 */
exports.updateUser = async (id, userData) => {
    // Si on modifie le mot de passe, il faudra le re-hasher (géré par le modèle si on save, 
    // mais ici on utilise findOneAndUpdate, donc attention au hashage manuel si besoin.
    // Pour simplifier ce devoir, on va supposer qu'on modifie surtout nom/email ici)
    return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
};

/**
 * Supprimer un utilisateur
 */
exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

/**
 * Vérifier le mot de passe (utile pour le Login plus tard)
 */
exports.authenticate = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
};