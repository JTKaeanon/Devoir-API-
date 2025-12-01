const Catway = require('../models/catway');

/* get catways */
exports.getAllCatways = async () => {
    try {
        return await Catway.find();
    } catch (error) {
        throw error;
    }
};

/*(catwayNumber) */
exports.getCatwayByNumber = async (catwayNumber) => {
    try {
        return await Catway.findOne({ catwayNumber: catwayNumber });
    } catch (error) {
        throw error;
    }
};

/**
 * Créer un nouveau catway
 */
exports.createCatway = async (catwayData) => {
    try {
        const catway = new Catway(catwayData);
        return await catway.save();
    } catch (error) {
        throw error;
    }
};

/**
 * Mettre à jour un catway (état seulement, selon le brief)
 */
exports.updateCatway = async (catwayNumber, catwayData) => {
    try {
        // On cherche par catwayNumber et on met à jour
        // { new: true } permet de renvoyer l'objet modifié et non l'ancien
        return await Catway.findOneAndUpdate(
            { catwayNumber: catwayNumber },
            { $set: { catwayState: catwayData.catwayState } }, 
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

/**
 * Supprimer un catway
 */
exports.deleteCatway = async (catwayNumber) => {
    try {
        return await Catway.findOneAndDelete({ catwayNumber: catwayNumber });
    } catch (error) {
        throw error;
    }
};