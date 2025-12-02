const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const catwaysRoutes = require('./routes/catways.routes'); 
const usersRoutes = require('./routes/users.routes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', usersRoutes);

app.use('/catways', catwaysRoutes);

app.get('/', (req, res) => {
    res.send('API Catways fonctionnelle !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});