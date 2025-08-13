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

// Get all applications (Read)
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ submissionDate: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
    }
};

// Get a single application by ID
const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch application', error: error.message });
    }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = Object.values(ApplicationStatus);
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        application.status = status;
        const updatedApplication = await application.save();
        
        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update application status', error: error.message });
    }
};

module.exports = { 
    generateApplicationId,
    createApplication, 
    getAllApplications,
    getApplicationById,
    updateApplicationStatus
};