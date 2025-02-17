const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware.js");
const { createState, getStates, deleteState } = require('../controllers/state.controller');

router.post('/state', verifyToken, createState);
router.get('/state', verifyToken, getStates);
router.delete('/state', verifyToken, deleteState);
module.exports = router;
