const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { Application, ApplicationStatus } = require('../models/Application');
const applicationController = require('../controllers/applicationController');
const { expect } = chai;

describe('CreateApplication Function Test', () => {

    it('should create a new application successfully', async () => {

        const mockApplication = {
            _id: new mongoose.Types.ObjectId(),
            applicationId: 'APP12345',
            applicationEmail: 'test@example.com',
            applicationPhone: '1234567890',
            programApplied: 'Startup Accelerator',
            startupName: 'Test Startup',
            description: 'This is a test startup',
            status: ApplicationStatus.PENDING
        };
        
        saveStub = sinon.stub(Application.prototype, 'save').resolves(mockApplication);

        await applicationController.createApplication(req, res);

        expect(res.status.calledOnceWith(201)).to.be.true;
        expect(res.json.calledOnceWith(mockApplication)).to.be.true;
    });

    it('should return 500 if there is an error during creation', async () => {
        sinon.stub(Application.prototype, 'save').rejects(new Error('Database error'));

        await applicationController.createApplication(req, res);

        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.include({
            message: 'Failed to create application',
            error: 'Database error'
        });
    });

    it('should validate required fields', async () => {
        req.body = { description: 'This is a test startup' }; // Missing required fields
        const validationError = new Error('Validation error');
        validationError.name = 'ValidationError';
        sinon.stub(Application.prototype, 'save').rejects(validationError);

        await applicationController.createApplication(req, res);

        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0].message).to.equal('Failed to create application');
    });
});