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
    const existingLiability = await Liability.findById(req.params.id);
    if (!existingLiability) {
      return res.status(404).json({ success: false, message: "Liability not found." });
    }
    let totalAmountPaid = 0;
    if (req.body.payments && Array.isArray(req.body.payments)) {
      req.body.payments.forEach(payment => {
        const isNewPayment = existingLiability.payments.every(existingPayment => {
          if (payment._id) {
            return existingPayment._id.toString() !== payment._id.toString();
          } else {
            return existingPayment.amountPaid !== payment.amountPaid || existingPayment.paidOn !== payment.paidOn;
          }
        });
        if (isNewPayment) {
          totalAmountPaid += payment.amountPaid;
        }
      });
      if (totalAmountPaid > 0) {
        if (req.body.totalOutstanding !== undefined) {
          req.body.totalOutstanding -= totalAmountPaid;
        }
        if (req.body.minimumOutstandingPayable !== undefined) {
          req.body.minimumOutstandingPayable -= totalAmountPaid;
        }
        // if (req.body.minimumPayableBeforeMonth !== undefined) {
        //   req.body.minimumPayableBeforeMonth -= totalAmountPaid;
        // }
      }
    }
    await Liability.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Liability updated successfully.",
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


exports.getTotalOutstanding = async (req, res) => {
  try {
    const result = await Liability.aggregate([
      {
        $group: {
          _id: null,
          totalOutstanding: { $sum: "$totalOutstanding" },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No liabilities found.",
      });
    }

    res.status(200).json({
      success: true,
      totalOutstanding: result[0].totalOutstanding,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
