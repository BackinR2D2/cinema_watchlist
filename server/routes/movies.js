const router = require('express').Router();
const {getTopMovies, getMovies, getMoviesCount, searchMovie, filterMovies, getCachedTopMovies} = require('../controllers/movies');
const auth = require('../helpers/auth');

// https://www.imdb.com/chart/top/
router.get('/top-movies', getCachedTopMovies, getTopMovies);
router.get('/user/movies', auth, getMovies);
router.get('/user/movies/count', auth, getMoviesCount);
router.get('/user/movies/search', auth, searchMovie);
router.get('/user/movies/filter', auth, filterMovies);

module.exports = router;