const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
const User = require('../models/User');
const { getProfile, updateUserProfile } = require('../controllers/authController');
const { expect } = chai;

chai.use(chaiHttp);

describe('GetProfile Function Test', () => {
    let findByIdStub;

    afterEach(() => {
        if (findByIdStub) findByIdStub.restore();
    });

    it('should return profile for the given user', async () => {
        const userId = new mongoose.Types.ObjectId();
        const mockProfile = {
            _id: userId,
            name: "John Doe",
            email: "john@example.com",
            role: "user"
        };

        findByIdStub = sinon.stub(User, 'findById').resolves(mockProfile);

        // Use _id to match controller logic
        const req = { user: { _id: userId } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getProfile(req, res);

        expect(findByIdStub.calledOnceWith(userId)).to.be.true;
        expect(res.json.calledWith(mockProfile)).to.be.true;
        expect(res.status.called).to.be.false;
    });

    it('should return 500 on error', async () => {
        findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));

        const req = { user: { _id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getProfile(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Server error' })).to.be.true;
    });
});

describe('UpdateUserProfile Function Test', () => {
    let findByIdStub;

    afterEach(() => {
        if (findByIdStub) findByIdStub.restore();
    });

    it('should change role and update user profile', async () => {
        const userId = new mongoose.Types.ObjectId();
        const initialUser = {
            id: userId,
            name: "Jane Doe",
            email: "jane@example.com",
            role: "mentor",
            university: "Old University",
            address: "Old Address",
            save: sinon.stub().resolvesThis()
        };

        findByIdStub = sinon.stub(User, 'findById').resolves(initialUser);

        const req = {
            user: { id: userId },
            body: {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                role: "admin",
                university: "New University",
                address: "New Address"
            }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await updateUserProfile(req, res);

        expect(initialUser.name).to.equal("Jane Smith");
        expect(initialUser.email).to.equal("jane.smith@example.com");
        expect(initialUser.role).to.equal("admin");
        expect(initialUser.university).to.equal("New University");
        expect(initialUser.address).to.equal("New Address");
        expect(initialUser.save.calledOnce).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(res.status.called).to.be.false;
    });

    it('should return 404 if user not found', async () => {
        findByIdStub = sinon.stub(User, 'findById').resolves(null);

        const req = { user: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await updateUserProfile(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'User not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
        findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));

        const req = { user: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await updateUserProfile(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
});