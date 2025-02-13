const mongoose = require("mongoose");

const liabilitySchema = new mongoose.Schema(
  {
    liabilityId: { type: String, required: true, unique: true },
    particulars: { type: [String], required: true },
    payableTo: { type: String, required: true, default: "Not specified" },
    payableBy: { type: Date, required: true },
    totalOutstanding: { type: Number, required: true },
    minimumOutstandingPayable: { type: Number, required: true },
    minimumPayableBeforeMonth: { type: Number, required: true, default: " " },
    remarks: { type: String, default: "No remarks provided" },
    payments: [
      {
        amountPaid: { type: Number },
        paidOn: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Liability", liabilitySchema);
