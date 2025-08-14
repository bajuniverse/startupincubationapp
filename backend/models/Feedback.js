const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Application',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);