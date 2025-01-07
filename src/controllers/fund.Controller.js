const FundsModel = require('../models/funds.model');

exports.registerFunds = async (req, res) => {
    const { funds } = req.body;
    if (!funds) {
        return res.status(400).json({ message: 'Funds are required.' });
    }
    try {
        const existingFund = await FundsModel.findOne({ funds });

        if (existingFund) {
            return res.status(400).json({ message: 'This fund is already registered.' });
        }
        const newFund = new FundsModel({
            funds,
        });
        await newFund.save();

        res.status(201).json({
            message: 'Funds registered successfully',
            user: {
                funds: newFund.funds,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getFunds = async (req, res) => {
    try {
      const funds = await FundsModel.find({}, { _id: 1, funds: 1 });
      res.status(200).json({
        message: "Funds retrieved successfully",
        funds,
      });
    } catch (error) {
      console.error("Error retrieving funds:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  