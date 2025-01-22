const receivable = require('../models/receivable.model');

const addReceivable = async (req, res) => {
    try {
        const { receivables } = req.body;
        if (!receivables) {
            return res.status(400).json({ message: 'Receivables field is required.' });
        }
        const existingReceivable = await receivable.findOne({ receivables });
        if (existingReceivable) {
            return res.status(409).json({ message: 'Receivable already exists.' });
        }
        const newReceivable = new receivable({ receivables });
        await newReceivable.save();
        res.status(201).json({ message: 'Receivable added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding receivable', error: error.message });
    }
};

const getAllReceivables = async (req, res) => {
    try {
        const receivables = await receivable.find({},{_id:0,__v:0});
        res.status(200).json({ message: 'Receivables fetched successfully', data: receivables });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching receivables', error: error.message });
    }
};

module.exports = {
    addReceivable,
    getAllReceivables,
};
