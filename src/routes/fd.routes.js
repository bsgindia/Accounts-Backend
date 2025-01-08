const express = require('express');
const router = express.Router();
const { registerFD, getAllFDs, getAllFDAmount ,updateFDByNumber } = require('../controllers/fd.controller');
const { verifyToken } = require("../middleware/auth.middleware.js");
router.post('/register-fd', verifyToken, registerFD);
router.get('/fds', verifyToken, getAllFDs);
router.get('/all',verifyToken ,getAllFDAmount);
router.put("/update/:fdNumber",verifyToken,updateFDByNumber);
module.exports = router;
