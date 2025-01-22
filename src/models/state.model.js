const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    state: {
    type: String,
    required: true,
  },
});

const state = mongoose.model('state', stateSchema);

module.exports = state ;


