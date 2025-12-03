const Catway = require('../models/catway');

/* get catways */

exports.getAllCatways = async () => {
    try {
        /**
*1 = croissant / -1 = décroissant */
        return await Catway.find().sort({ catwayNumber: 1 });
    } catch (error) {
        throw error;
    }
};

/**(catwayNumber) */
exports.getCatwayByNumber = async (catwayNumber) => {
    try {
        return await Catway.findOne({ catwayNumber: catwayNumber });
    } catch (error) {
        throw error;
    }
};

/**  nouveau catway */
exports.createCatway = async (catwayData) => {
    try {
        const catway = new Catway(catwayData);
        return await catway.save();
    } catch (error) {
        throw error;
    }
};

/**  update catway */
exports.updateCatway = async (catwayNumber, catwayData) => {
    try {
    
        return await Catway.findOneAndUpdate(
            { catwayNumber: catwayNumber },
            { $set: { catwayState: catwayData.catwayState } }, 
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

/** Supprimer  catway */
exports.deleteCatway = async (catwayNumber) => {
    try {
        return await Catway.findOneAndDelete({ catwayNumber: catwayNumber });
    } catch (error) {
        throw error;
    }
};