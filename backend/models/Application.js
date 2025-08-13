const mongoose = require('mongoose');

const ApplicationStatus = {
    PENDING: 'Pending',
    UNDER_REVIEW: 'Under Review',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected'
};

const applicationSchema = new mongoose.Schema({
    applicationId: { type: String, required: true, unique: true },
    submissionDate: { type: Date, default: Date.now },
    applicationEmail: { type: String, required: true, trim: true },
    applicationPhone: { type: String, required: true, trim: true },
    programApplied: { type: String, required: true },
    startupName: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: Object.values(ApplicationStatus),
        default: ApplicationStatus.PENDING
    }
}, {
    timestamps: { createdAt: 'createdDateTime', updatedAt: 'updatedDateTime' }
});

module.exports = {
    Application: mongoose.model('Application', applicationSchema),
    ApplicationStatus
};