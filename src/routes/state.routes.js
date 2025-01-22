const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware.js");
const { createState, getStates } = require('../controllers/state.controller');

router.post('/state',verifyToken, createState);
router.get('/state',verifyToken, getStates);

module.exports = router;
