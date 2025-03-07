const express = require('express');
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware.js");
const { addReceivable, getAllReceivables, deleteReceivable } = require('../controllers/receivable.controller.js');
router.post('/register', verifyToken, addReceivable);
router.get("/get-receivable", verifyToken, getAllReceivables);
router.delete('/delete-receivable', verifyToken, deleteReceivable);
module.exports = router;

