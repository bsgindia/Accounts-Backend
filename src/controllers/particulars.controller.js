const ParticularsModel = require('../models/particulars.model');

exports.registerparticulars = async (req, res) => {
    const { particulars } = req.body;
    if (!particulars) {
        return res.status(400).json({ message: 'particulars are required.' });
    }
    try {
        const existingparticulars = await ParticularsModel.findOne({ particulars });

        if (existingparticulars) {
            return res.status(400).json({ message: 'This Liability is already registered.' });
        }
        const newparticulars = new ParticularsModel({
            particulars,
        });
        await newparticulars.save();

        res.status(201).json({
            message: 'Liability registered successfully',
            user: {
                particulars: newparticulars.particulars,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getparticulars = async (req, res) => {
    try {
      const particulars = await ParticularsModel.find({}, { _id: 1, particulars: 1 });
      res.status(200).json({
        message: "Funds retrieved successfully",
        particulars,
      });
    } catch (error) {
      console.error("Error retrieving particulars:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  