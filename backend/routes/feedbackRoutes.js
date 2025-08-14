const express = require('express');
const { 
  getFeedbackByApplication, 
  addFeedback, 
  updateFeedback, 
  deleteFeedback 
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/application/:applicationId', protect, getFeedbackByApplication);
router.post('/application/:applicationId', protect, addFeedback);
router.put('/:id', protect, updateFeedback);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;