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
