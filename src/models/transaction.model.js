const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    particular: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        index: true
    },
    debit: {
        type: Number,
        default: 0,
        min: 0
    },
    credit: {
        type: Number,
        default: 0,
        min: 0
    },
    transactionType: {
        type: String,
        enum: ["debit", "credit"],
        required: true
    },
    balanceBeforeTransaction: { type: Number, required: true },
    balanceAfterTransaction: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "completed"
    }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
