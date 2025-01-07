const express = require('express');
const router = express.Router();
const { registerFD } = require('../controllers/fd.controller');

router.post('/register-fd', registerFD);

module.exports = router;
