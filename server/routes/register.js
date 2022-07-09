const router = require('express').Router();
const { verify, register } = require('../controllers/register');

router.post('/verify', verify);
router.post('/register', register);

module.exports = router;