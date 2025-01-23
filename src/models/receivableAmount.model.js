const mongoose = require('mongoose');

const ReceivableAmountSchema = new mongoose.Schema(
  {
    receivableId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Receivabledeatails',
        },
      ],
    receivedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    details: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ReceivableAmount', ReceivableAmountSchema);
