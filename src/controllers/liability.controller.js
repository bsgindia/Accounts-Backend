const Liability = require("../models/liability.model"); 


exports.createLiability = async (req, res) => {
    try {
      const { liabilityId } = req.body;
      const existingLiability = await Liability.findOne({ liabilityId });
      if (existingLiability) {
        return res.status(400).json({
          success: false,
          message: "Liability with this ID already exists.",
        });
      }
     await Liability.create(req.body);
      res.status(201).json({
        success: true,
        message: "Liability created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  


exports.getAllLiabilities = async (req, res) => {
  try {
    const liabilities = await Liability.find();
    res.status(200).json({ success: true, data: liabilities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getLiabilityById = async (req, res) => {
  try {
    const liability = await Liability.findById(req.params.id);
    if (!liability) {
      return res.status(404).json({ success: false, message: "Liability not found." });
    }
    res.status(200).json({ success: true, data: liability });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLiability = async (req, res) => {
  try {
    const liability = await Liability.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!liability) {
      return res.status(404).json({ success: false, message: "Liability not found." });
    }
    res.status(200).json({
      success: true,
      message: "Liability updated successfully.",
      data: liability,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteLiability = async (req, res) => {
  try {
    const liability = await Liability.findByIdAndDelete(req.params.id);
    if (!liability) {
      return res.status(404).json({ success: false, message: "Liability not found." });
    }
    res.status(200).json({ success: true, message: "Liability deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
