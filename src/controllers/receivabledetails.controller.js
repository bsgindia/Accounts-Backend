const receivableDeatails = require('../models/receivabledeatails.model');

const registerReceivable = async (req, res) => {
    try {
        const {
            receivableType,
            description,
            receivableFor,
            receivableFromDate,
            receivableFromState,
            receivableAmount,
            status,
        } = req.body;
        if (
            !receivableType ||
            !description ||
            !receivableFor ||
            !receivableFromDate ||
            !receivableFromState ||
            !receivableAmount ||
            !status
        ) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newReceivable = new receivableDeatails({
            receivableType,
            description,
            receivableFor,
            receivableFromDate,
            receivableFromState,
            receivableAmount,
            status,
        });
        await newReceivable.save();
        res.status(201).json({ message: 'Receivable added successfully' });
    } catch (error) {
        console.error('Error adding receivable:', error);
        res.status(500).json({ message: 'Error adding receivable', error: error.message });
    }
};
const getReceivables = async (req, res) => {
    try {
        const receivables = await receivableDeatails.find({},{_id:0,__v:0});
        if (!receivables || receivables.length === 0) {
            return res.status(404).json({ message: 'No receivables found.' });
        }
        res.status(200).json({ data: receivables });
    } catch (error) {
        console.error('Error fetching receivables:', error);
        res.status(500).json({ message: 'Error fetching receivables', error: error.message });
    }
};

const ReceivablesID = async (req, res) => {
    try {
        const receivables = await receivableDeatails.find({},{receivableId:1});
        if (!receivables || receivables.length === 0) {
            return res.status(404).json({ message: 'No receivables found.' });
        }
        res.status(200).json({ data: receivables });
    } catch (error) {
        console.error('Error fetching receivables:', error);
        res.status(500).json({ message: 'Error fetching receivables', error: error.message });
    }
};
const editReceivable = async (req, res) => {
    try {
        const { receivableId } = req.params;
        const updateData = req.body;
        
        const updatedReceivable = await receivableDeatails.findOneAndUpdate({ receivableId }, updateData, { new: true });
        
        if (!updatedReceivable) {
            return res.status(404).json({ message: 'Receivable not found.' });
        }
        res.status(200).json({ message: 'Receivable updated successfully', data: updatedReceivable });
    } catch (error) {
        console.error('Error updating receivable:', error);
        res.status(500).json({ message: 'Error updating receivable', error: error.message });
    }
};

module.exports = {
    registerReceivable, getReceivables,ReceivablesID,editReceivable
};
