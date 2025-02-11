const ReceivableAmount = require('../models/receivableAmount.model');
const Receivable = require("../models/receivabledeatails.model");
const mongoose = require("mongoose");

exports.addReceivableAmount = async (req, res) => {
  try {
    const { receivableId, receivedAmount, details } = req.body;

    // Validate input
    if (!Array.isArray(receivableId) || receivableId.length === 0) {
      return res.status(400).json({ message: "Receivable ID(s) must be an array and cannot be empty." });
    }

    if (receivedAmount === undefined) {
      return res.status(400).json({ message: "Received Amount is required." });
    }

    // Validate and convert each receivableId to ObjectId
    const validIds = receivableId.filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => new mongoose.Types.ObjectId(id));

    if (validIds.length !== receivableId.length) {
      return res.status(400).json({ message: "One or more Receivable IDs are invalid." });
    }

    // Find all matching receivable records
    const receivables = await Receivable.find({ _id: { $in: validIds } });

    if (receivables.length !== validIds.length) {
      return res.status(404).json({ message: "One or more receivable records not found." });
    }

    // Deduct the full receivedAmount from each receivableId provided
    for (const receivable of receivables) {
      if (receivable.receivableAmount < receivedAmount) {
        return res.status(400).json({
          message: `Receivable ID ${receivable._id} does not have enough balance.`,
        });
      }

      receivable.receivableAmount -= receivedAmount;
      await receivable.save();
    }

    // Save the transaction record
    const receivableAmount = new ReceivableAmount({
      receivableId: validIds, // Store array of ObjectIds
      receivedAmount,
      details,
    });

    await receivableAmount.save();

    res.status(201).json({
      message: "Receivable amounts updated successfully.",
      updatedReceivables: receivables,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add receivable amount.",
      error: error.message,
    });
  }
};



exports.getReceivableAmounts = async (req, res) => {
  try {
    const receivables = await ReceivableAmount.find().populate('receivableId').exec();
    const receivableData = receivables.map(receivable => ({
      ...receivable.toObject(),
      receivableId: receivable.receivableId.map(item => item.receivableId)
    }));
    res.status(200).json({ data: receivableData });
  } catch (error) {
    console.error("Error fetching receivables:", error.message);
    res.status(500).json({ message: "Failed to fetch receivable amounts.", error: error.message });
  }
};
