const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const User = require('../models/User');
const { getProfile } = require('../controllers/authController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('GetProfile Function Test', () => {

    it('should return profile for the given user', async () => {
        // Mock user ID
        const userId = new mongoose.Types.ObjectId();

        // Mock user profile data
        const mockProfile = {
            _id: userId,
            name: "John Doe",
            email: "john@example.com",
            role: "user"
        };

        // Stub User.findById to return mock profile
        const findByIdStub = sinon.stub(User, 'findById').resolves(mockProfile);

        // Mock request & response
        const req = { user: { id: userId } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await getProfile(req, res);

        // Assertions
        expect(findByIdStub.calledOnceWith(userId)).to.be.true;
        expect(res.json.calledWith(mockProfile)).to.be.true;
        expect(res.status.called).to.be.false; // No error status should be set

        // Restore stubbed methods
        findByIdStub.restore();
    });

    it('should return 500 on error', async () => {
        // Stub User.findById to throw an error
        const findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));

        // Mock request & response
        const req = { user: { id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await getProfile(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

});