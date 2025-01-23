const ReceivableAmount = require('../models/receivableAmount.model');

exports.addReceivableAmount = async (req, res) => {
  try {
    const { receivableId, receivedAmount, details } = req.body;
    if (!receivableId || receivedAmount === undefined) {
      return res.status(400).json({ message: 'Receivable ID and Received Amount are required.' });
    }
    const receivableAmount = new ReceivableAmount({
      receivableId,
      receivedAmount,
      details,
    });
    await receivableAmount.save();
    res.status(201).json({ message: 'Receivable amount added successfully.'});
  } catch (error) {
    res.status(500).json({ message: 'Failed to add receivable amount.', error: error.message });
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
  