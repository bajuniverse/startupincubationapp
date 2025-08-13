const express = require('express');
const router = express.Router();
const { createApplication } = require('../controllers/applicationController');
// const { protect } = require('../middleware/authMiddleware');

// Public route for submitting applications
router.post('/apply', createApplication);

module.exports = router;