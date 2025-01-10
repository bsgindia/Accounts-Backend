const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: "",
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
    default: "", 
  },
  branchName: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  accountType: {
    type: String,
    required: true,
    set: (value) => value.toUpperCase(),
    default: "",
  },
  bookBalance: {
    type: Number,
    required: true,
    min: 0,
  },
  bankBalance: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ["ACTIVE", "INACTIVE", "CLOSED"], 
    set: (value) => value.toUpperCase(),
    default: "active",
  },
  routingNumberOrIFSC: {
    type: String,
    required: true,
    trim: true,
    default: "", 
  },
  openingDate: {
    type: Date,
    required: true,
  },
  contactPerson: {
      type: String,
      required: true,
      default: "",
  },
  notes: {
    type: String,
    trim: true,
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model("BankAccount", bankAccountSchema);
