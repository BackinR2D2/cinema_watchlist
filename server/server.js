require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(require('helmet')());

const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use(require('morgan')('dev'));

const movies = require('./routes/movies');
const tvshows = require('./routes/tvshows');
const login = require('./routes/login');
const register = require('./routes/register');
const auth = require('./helpers/auth');
const watchlist = require('./routes/watchlist');
const account = require('./routes/account');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/auth/validate', auth, (req, res) => {
    res.status(200).json({
        valid: true
    });
});

app.use('/api', register);
app.use('/api', login);
app.use('/api', movies);
app.use('/api', tvshows);
app.use('/api', require('./routes/search'));
app.use('/api', watchlist);
app.use('/api', account);

app.get('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})