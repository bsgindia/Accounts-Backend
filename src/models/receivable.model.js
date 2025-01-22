const mongoose = require('mongoose');

const receivableSchema = new mongoose.Schema({
    receivables: {
    type: String,
    required: true,
  },
});

const receivable = mongoose.model('receivable', receivableSchema);

module.exports = receivable ;


