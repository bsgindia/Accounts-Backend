const FDModel = require('../models/fd.model');

exports.registerFD = async (req, res) => {
    const {
        fdNumber,
        connectingAccount,
        principalAmount,
        fdAdmount,
        startDate,
        maturityDate,
        interestRate,
        maturityAmount,
        interestEarned,
        renewalStatus,
        lockingPeriod,
        remarks,
    } = req.body;
    if (
        !fdNumber ||
        !connectingAccount ||
        !principalAmount ||
        !startDate ||
        !maturityDate ||
        !interestRate ||
        !maturityAmount ||
        !lockingPeriod
    ) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
    }
    try {
        const existingFD = await FDModel.findOne({ fdNumber });
        if (existingFD) {
            return res.status(400).json({ message: 'FD with this number already exists.' });
        }
        const fd = new FDModel({
            fdNumber,
            connectingAccount,
            principalAmount,
            fdAdmount,
            startDate,
            maturityDate,
            interestRate,
            maturityAmount,
            interestEarned,
            renewalStatus,
            lockingPeriod,
            remarks,
        });
        await fd.save();
        res.status(201).json({
            message: 'FD registered successfully',
            fd,
        });
    } catch (error) {
        console.error('Error registering FD:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};  




exports.getAllFDs = async (req, res) => {
    
    try {
        const fds = await FDModel.find({});      
        if (fds.length === 0) {
            return res.status(404).json({ message: 'No FDs found' });
        }
        res.status(200).json({
            message: 'All FD details fetched successfully',
            fds,
        });
    } catch (error) {
        console.error('Error fetching FD details:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllFDAmount = async (req, res) => {
    try {
        const result = await FDModel.aggregate([
            { 
                $project: { 
                    fdAdmount: { $toDouble: "$fdAdmount" }, 
                    maturityAmount: { $toDouble: "$maturityAmount" } 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    totalAmount: { $sum: "$fdAdmount" }, 
                    totalMaturityAmount: { $sum: "$maturityAmount" } 
                } 
            }
        ]);

        const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
        const totalMaturityAmount = result.length > 0 ? result[0].totalMaturityAmount : 0;

        const fds = await FDModel.find({}).select('fdAdmount maturityAmount');

        if (fds.length === 0) {
            return res.status(404).json({ message: 'No FDs found' });
        }

        res.status(200).json({
            message: 'All FD details fetched successfully',
            totalAmount,
            totalMaturityAmount
        });
    } catch (error) {
        console.error('Error fetching FD details:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.updateFDByNumber = async (req, res) => {
    const { fdNumber } = req.params;
    const updateData = req.body;
    if (!fdNumber) {
        return res.status(400).json({ message: 'FD number must be provided.' });
    }
    try {
        const existingFD = await FDModel.findOne({ fdNumber });
        if (!existingFD) {
            return res.status(404).json({ message: 'FD with this number does not exist.' });
        }
        const updatedFD = await FDModel.findOneAndUpdate(
            { fdNumber },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: 'FD updated successfully',
            updatedFD,
        });
    } catch (error) {
        console.error('Error updating FD:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getFundSums = async (req, res) => {
    try {
        const result = await FDModel.aggregate([
            { $unwind: "$principalAmount" },
            {
                $group: {
                    _id: "$principalAmount.fund",
                    totalAmount: { $sum: "$principalAmount.amount" }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'No funds found.' });
        }

        res.status(200).json({
            message: 'Sum of all funds fetched successfully',
            result
        });
    } catch (error) {
        console.error('Error fetching sum of funds:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};