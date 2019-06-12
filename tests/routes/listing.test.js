// Mongoose and mocking requests
const sinon = require('sinon');

const mongoose = require('mongoose')
require('sinon-mongoose')

// initialize the app and models
const app = require('../../index.js')

// sending requests
const agent = require('supertest').agent(app);
// validating results
const expect = require('chai').expect;

// get the model
const Listing = mongoose.model('Listing')

var Mock = sinon.mock(Listing)

beforeEach(() => {
	Mock.restore(); // Unwraps the spy
});

afterEach( () => {
	Mock.verify();
});

	const expected = {
		//...
		"address": {
			"geo": {
				"lat":11,
				"lng":14
				},
				"city":"Vaxjo",
				"municipality":"Vaxjo",
				"street":"PG 12"
				},
				"_id":"5d00b19fa886171528c5dfc4",
				"type":"villa",
				"price":"50,000 SEK",
				"monthly_fee":"5000 SEK",
				"bidding_status":"inactive",
				"__v":0
	};

describe('listings.get', ()  => {

	it('Should return an array of all listings', (done) => {

		// Given (preconditions)
		Mock
		.expects('find')
		.chain('exec')
		.resolves([expected]);

		// When (someting happens)
		agent
		.get('/listings')
		.end((err,res) => {
		// Then (something should happen)
			expect(res.status).to.equal(200);
			expect(res.body).to.eql([expected]);
			done();
		});
	});
	
	it('Should return a listing by type', (done) => {
		Mock
		.expects('findOne')
		.withArgs({"type": "villa"})
		.chain('exec')
		.resolves(expected);
		
		agent
		.get('/listings?type=villa')
		.end((err, res) => {
			expect(res.status).to.equal(200);
			expect(res.body).to.eql(expected);
			done();
		})
	});
});