const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis']
    }
}, {
    timestamps: true
});

// Middleware : Hachage du mot de passe avant la sauvegarde
UserSchema.pre('save', async function() {
    // Note : On a retiré le paramètre "next" dans la parenthèse du function()

    // Si le mot de passe n'a pas été modifié, on arrête là
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // Plus besoin d'appeler next(), Mongoose gère ça tout seul avec le async/await
    } catch (error) {
        throw error; // On lance l'erreur directement
    }
});

module.exports = mongoose.model('User', UserSchema);