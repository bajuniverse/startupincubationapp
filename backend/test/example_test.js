const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getProfile, updateUserProfile } = require('../controllers/authController');
const { expect } = chai;

describe('GetProfile Function Test', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return profile for the given user', async () => {
        const userId = new mongoose.Types.ObjectId();
        const mockProfile = {
            _id: userId,
            name: "John Doe",
            email: "john@example.com",
            role: "user"
        };

        // Stub findById to return an object with select()
        const selectStub = sinon.stub().resolves(mockProfile);
        const findByIdStub = sinon.stub(User, 'findById').returns({ select: selectStub });

        const req = { user: { _id: userId } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getProfile(req, res);

        expect(findByIdStub.calledOnceWith(userId)).to.be.true;
        expect(selectStub.calledOnceWith('-password')).to.be.true;
        expect(res.json.calledOnceWith(mockProfile)).to.be.true;
        expect(res.status.called).to.be.false; // no error status called
    });

    it('should return 404 if user not found', async () => {
        const selectStub = sinon.stub().resolves(null);
        sinon.stub(User, 'findById').returns({ select: selectStub });

        const req = { user: { _id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getProfile(req, res);

        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWithMatch({ message: 'User not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
        const selectStub = sinon.stub().rejects(new Error('DB Error'));
        sinon.stub(User, 'findById').returns({ select: selectStub });

        const req = { user: { _id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getProfile(req, res);

        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWithMatch({ message: 'Server error' })).to.be.true;
    });
});

describe('UpdateUserProfile Function Test', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should change role and update user profile', async () => {
        const userId = new mongoose.Types.ObjectId();
        const initialUser = {
            _id: userId,
            id: userId.toString(),
            name: "Jane Doe",
            email: "jane@example.com",
            role: "mentor",
            university: "Old University",
            address: "Old Address",
            save: sinon.stub().resolvesThis()
        };

        initialUser.save = sinon.stub().resolves(initialUser);
        sinon.stub(User, 'findById').resolves(initialUser);

        const req = {
            user: { id: userId.toString() },
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
    });

    it('should return 404 if user not found', async () => {
        sinon.stub(User, 'findById').resolves(null);

        const req = { user: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await updateUserProfile(req, res);

        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWithMatch({ message: 'User not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
        sinon.stub(User, 'findById').rejects(new Error('DB Error'));

        const req = { user: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await updateUserProfile(req, res);

        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWithMatch({ message: 'Server error' })).to.be.true;
    });
});
