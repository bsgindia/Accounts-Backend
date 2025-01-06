const mongoose = require('mongoose');

const fdSchema = new mongoose.Schema(
    {
        fdNumber: {
            type: String,
            required: true,
            unique: true,
            default: "",
        },
        connectingAccount: {
            type: String,
            required: true,
            default: "",
        },
        principalAmount: [
            {
                fund: { type: String, required: true },
                amount: { type: Number, required: true },
            },
        ],
        fdAdmount: {
            type: String,
            required: true,
            unique: true,
            default: "",
        },
        startDate: {
            type: Date,
            required: true,
        },
        maturityDate: {
            type: Date,
            required: true,
            default: function () {
                const oneYearLater = new Date(this.startDate);
                oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                return oneYearLater;
            },
        },
        interestRate: {
            type: Number,
            required: true,
            default: 0,
        },
        maturityAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        interestEarned: {
            type: Number,
            required: true,
        },
        renewalStatus: {
            type: String,
            enum: ["Yes", "No"],
            default: "No",
            required: true,
        },
        lockingPeriod: {
            type: String,
            required: true,
            default: "",
        },
        remarks: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const FD = mongoose.model("FD", fdSchema);

module.exports = FD;
