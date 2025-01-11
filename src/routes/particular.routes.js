const express = require('express');
const router = express.Router();
const particularsController = require('../controllers/particulars.controller.js');
const { verifyToken } = require("../middleware/auth.middleware.js");

router.post('/register-particulars',verifyToken, particularsController.registerparticulars);
router.get("/get-particulars",verifyToken,particularsController.getparticulars);

module.exports = router;
