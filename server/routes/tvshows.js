const router = require('express').Router();
const {getTopTvShows, getTvShows, getTvShowsCount, searchTvShows, filterTvShows, getCachedTopTvShows} = require('../controllers/tvshows');
const auth = require('../helpers/auth');

// https://www.imdb.com/chart/top/

router.get('/top-tvshows', getCachedTopTvShows, getTopTvShows);
router.get('/user/tvshows', auth, getTvShows);
router.get('/user/tvshows/count', auth, getTvShowsCount);
router.get('/user/tvshows/search', auth, searchTvShows);
router.get('/user/tvshows/filter', auth, filterTvShows);

module.exports = router;