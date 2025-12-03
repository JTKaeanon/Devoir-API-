const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser'); 

/**
*Import 
*/
const catwaysRoutes = require('./routes/catways.routes');
const usersRoutes = require('./routes/users.routes');
const indexRoutes = require('./routes/index'); 

dotenv.config();

/**
*connexion db 
*/
connectDB();

const app = express();

/**
*Config EJS 
*/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser()); 


app.use((req, res, next) => {
    

    if (req.cookies && req.cookies.token) {
        res.locals.user = req.cookies.token;
    } else {
        res.locals.user = null;
    }
    next();
});

/**
*déclaration routes 
*/
app.use('/catways', catwaysRoutes);
app.use('/users', usersRoutes);
app.use('/', indexRoutes); 

/**
*server 
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});