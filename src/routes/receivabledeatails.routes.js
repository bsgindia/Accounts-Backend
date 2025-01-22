const express = require('express');
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware.js");
const { registerReceivable, getReceivables } = require('../controllers/receivabledetails.controller.js');

router.post('/register',verifyToken, registerReceivable);
router.get('/get-receivable', getReceivables);

module.exports = router;
