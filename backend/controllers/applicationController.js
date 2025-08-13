const { Application, ApplicationStatus } = require('../models/Application');
const crypto = require('crypto');

// Generate a unique application ID
const generateApplicationId = async () => {
    const timestamp = new Date().getTime().toString();
    const randomStr = crypto.randomBytes(4).toString('hex');
    const applicationId = `app-${timestamp.substring(timestamp.length - 6)}-${randomStr}`;
    
    // Make sure the ID is unique
    const existingApplication = await Application.findOne({ applicationId });
    if (existingApplication) {
        return generateApplicationId();
    }
    
    return applicationId;
};

// Create a new application
const createApplication = async (req, res) => {
    try {
        const { applicationEmail, applicationPhone, programApplied, startupName, description } = req.body;

        // Generate a unique application ID
        const applicationId = await generateApplicationId();
        const application = new Application({ applicationId, applicationEmail, applicationPhone, programApplied, startupName, description });
        const savedApplication = await application.save();
        res.status(201).json(savedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create application', error: error.message });
    }
};

module.exports = { createApplication, generateApplicationId };