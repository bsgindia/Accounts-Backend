const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  funds: {
    type: String,
    required: true,
  },
});

const fund = mongoose.model('fund', fundSchema);

module.exports = fund;
