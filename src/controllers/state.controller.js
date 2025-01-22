const State = require('../models/state.model');

exports.createState = async (req, res) => {
    try {
        const { state } = req.body;

        if (!state) {
            return res.status(400).json({ message: 'State field is required.' });
        }
        const existingState = await State.findOne({ state });
        if (existingState) {
            return res.status(409).json({ message: 'State already exists.' });
        }

        // Create and save the new state
        const newState = new State({ state });
        await newState.save();

        res.status(201).json({
            message: 'State created successfully.',
            state: newState,
        });
    } catch (error) {
        console.error('Error creating state:', error);
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
        });
    }
};

exports.getStates = async (req, res) => {
    try {
        const states = await State.find({},{_id:0,__v:0});

        res.status(200).json({
            message: 'States fetched successfully.',
            data: states,
        });
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
        });
    }
};
