const router = require('express').Router();
const {getUserData, deletedUser} = require('../controllers/account');
const auth = require('../helpers/auth');

router.get('/user/account', auth, getUserData);
router.delete('/user/account', auth, deletedUser);

module.exports = router;