const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { Application, ApplicationStatus } = require('../models/Application');
const applicationController = require('../controllers/applicationController');
const { expect } = chai;

describe('CreateApplication Function Test', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create a new application successfully', async () => {

        req.body = {
            applicationId: 'APP12345',
            applicationEmail: 'test@example.com',
            applicationPhone: '1234567890',
            programApplied: 'Startup Accelerator',
            startupName: 'Test Startup',
            description: 'This is a test startup'
        };

        const mockApplication = {
            _id: new mongoose.Types.ObjectId(),
            applicationId: 'app-123456-abcd12',
            ...req.body,
            status: ApplicationStatus.PENDING
        };
        
        sinon.stub(Application, 'findOne').resolves(null);
        sinon.stub(Application.prototype, 'save').resolves(mockApplication);

        await applicationController.createApplication(req, res);

        expect(res.status.calledOnceWith(201)).to.be.true;
        expect(res.json.calledOnceWith(mockApplication)).to.be.true;
    });

    it('should return 500 if there is an error during creation', async () => {
        req.body = {
            applicationId: 'APP12345',
            applicationEmail: 'test@example.com',
            applicationPhone: '1234567890',
            programApplied: 'Startup Accelerator',
            startupName: 'Test Startup',
            description: 'This is a test startup'
        };

        sinon.stub(Application, 'findOne').resolves(null);
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
        req.body = { description: 'This is a test startup' };
        const validationError = new Error('Validation error');
        validationError.name = 'ValidationError';

        sinon.stub(Application, 'findOne').resolves(null);
        sinon.stub(Application.prototype, 'save').rejects(validationError);

        await applicationController.createApplication(req, res);

        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0].message).to.equal('Failed to create application');
    });
});