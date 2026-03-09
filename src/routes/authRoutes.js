const { Router } = require('express');
const { generateToken } = require('../controllers/authController');

const router = Router();

router.post('/token', generateToken);

module.exports = router;
