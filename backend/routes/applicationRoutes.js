const express = require('express');
const router = express.Router();
const { 
    createApplication, 
    getAllApplications,
    getApplicationById,
    updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route for submitting applications
router.post('/apply', createApplication);

// Protected routes for managing applications
router.get('/', protect, adminOnly, getAllApplications);
router.get('/:id', protect, adminOnly, getApplicationById);
router.patch('/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;