const router = require('express').Router();
const {addToWatchlist, updateNoteBody, getNoteBody, deleteWatchlistMedia, changeStatus, changeFavorite} = require('../controllers/watchlist');
const auth = require('../helpers/auth');

router.post('/watchlist', auth, addToWatchlist);
router.post('/user/watchlist', auth, updateNoteBody);
router.post('/user/notebody', auth, getNoteBody);
router.delete('/user/watchlist/:id', auth, deleteWatchlistMedia);
router.put('/user/watchlist', auth, changeStatus);
router.put('/user/watchlist/favorite', auth, changeFavorite);

module.exports = router;