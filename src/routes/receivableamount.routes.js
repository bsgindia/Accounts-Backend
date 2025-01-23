const express = require('express');
const receivableController = require('../controllers/receivableAmount.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/add-receivable-amount',verifyToken, receivableController.addReceivableAmount);
router.get('/get-receivable-amounts/all',verifyToken, receivableController.getReceivableAmounts);

module.exports = router;


