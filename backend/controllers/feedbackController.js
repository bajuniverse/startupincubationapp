const Feedback = require('../models/Feedback');
const { Application } = require('../models/Application');

// Get all feedback for an application
const getFeedbackByApplication = async (req, res) => {
  try {
    const feedback = await Feedback.find({ application: req.params.applicationId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error getting feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add feedback to an application
const addFeedback = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const applicationId = req.params.applicationId;

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Create new feedback
    const feedback = await Feedback.create({
      application: applicationId,
      user: req.user._id,
      comment,
      rating,
    });

    // Populate user data before sending response
    await feedback.populate('user', 'name');
    
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Only the feedback creator can update it
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }
    
    feedback.comment = comment || feedback.comment;
    if (rating !== undefined) feedback.rating = rating;
    
    const updatedFeedback = await feedback.save();
    await updatedFeedback.populate('user', 'name');
    
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Only the creator or an admin can delete
    if (feedback.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }
    
    await feedback.deleteOne();
    res.status(200).json({ message: 'Feedback deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFeedbackByApplication,
  addFeedback,
  updateFeedback,
  deleteFeedback
};