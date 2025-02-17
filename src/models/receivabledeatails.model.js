const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);

const receivableSchema = new mongoose.Schema(
    {
        receivableId: {
            type: Number,
            unique: true,
        },
        receivableType: {
            type: [String],
            required: true,
        },
        description: {
            type: String,
            default:"",
        },
        receivableFor: {
            type: Number,
            required: true,
            min: 1900,
        },
        receivableFromDate: {
            type: Date,
            required: true,
        },
        receivableFromState: {
            type: [String],
            required: true,
        },
        receivableAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Paid', 'WaiveOff'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);
receivableSchema.plugin(mongooseSequence, { inc_field: 'receivableId' });
const Receivable = mongoose.model('Receivabledeatails', receivableSchema);

module.exports = Receivable;
