const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware.js");
const { registerReceivable, getReceivables, ReceivablesID, editReceivable } = require('../controllers/receivabledetails.controller.js');

router.post('/register',verifyToken, registerReceivable);
router.get('/get-receivable',verifyToken, getReceivables);
router.get('/get-receivableid',verifyToken,ReceivablesID);
router.put('/receivables/:receivableId',verifyToken, editReceivable);
module.exports = router;
