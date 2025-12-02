const User = require('../models/user');
const bcrypt = require('bcryptjs');

/* Récupérerles utilisateurs */
exports.getAllUsers = async () => {
    return await User.find().select('-password'); // mdp caché
};

/* Récupérer utilisateur par ID */
exports.getUserById = async (id) => {
    return await User.findById(id).select('-password');
};

/* New users */
exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

// Fonction pour modifier un user
exports.updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
};

/*delete users */
exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};


exports.authenticate = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
};