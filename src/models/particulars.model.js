const mongoose = require('mongoose');

const particularsSchema = new mongoose.Schema({
    particulars: {
    type: String,
    required: true,
  },
});

const particular = mongoose.model('particulars', particularsSchema);

module.exports = particular;
