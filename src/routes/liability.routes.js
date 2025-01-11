const express = require("express");
const router = express.Router();
const {
  createLiability,
  getAllLiabilities,
  getLiabilityById,
  updateLiability,
  deleteLiability,
} = require("../controllers/liability.controller");
const { verifyToken } = require("../middleware/auth.middleware.js");

router.post("/",verifyToken, createLiability);
router.get("/",verifyToken, getAllLiabilities); 
router.get("/:id",verifyToken, getLiabilityById); 
router.put("/:id",verifyToken, updateLiability);
router.delete("/:id",verifyToken, deleteLiability);

module.exports = router;
