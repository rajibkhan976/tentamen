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
	Mock = sinon.mock(Listing);
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
	
	const request = {
		"address": {
			"geo": {
				"lat":11,
				"lng":14
				},
				"city":"Vaxjo",
				"municipality":"Vaxjo",
				"street":"PG 12"
				},
				"type":"villa",
				"price":"50,000 SEK",
				"monthly_fee":"5000 SEK",
				"bidding_status":"inactive",
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
	
	describe('listings.post', () => {
		it('Should be able to add an item to listing', (done) => {
			Mock
			.expects('create')
			.withArgs(request)
			.chain('exec')
			.resolves(expected);
			
			agent
			.post('/listings/')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(201);
				expect(res.body).to.eql(expected);
				done();
			})
			
		})
	});
	
	describe('listings.patch', () => {
		
		it('Should be able to create an item in the listing', (done) => {
			Mock
			.expects('updateOne')
			.withArgs({ _id: "5d00b19fa886171528c5dfc4" }, request)
			.chain('exec')
			.resolves({ n: 1,
					    nModified: 0,
					    upserted: [ {index: 0, _id: "5d00b19fa886171528c5dfc4"}],
					    ok: 1 });
						
			agent
			.put('/listings/5d00b19fa886171528c5dfc4')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(201);
				done();
			});
		});
		
		it('Should be able to update an item in the listing', (done) => {
			Mock
			.expects('updateOne')
			.withArgs({ _id: "5d00b19fa886171528c5dfc4" }, request)
			.chain('exec')
			.resolves({ n: 1,
					    nModified: 1,
					    ok: 1 });
						
			agent
			.put('/listings/5d00b19fa886171528c5dfc4')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(200);
				done();
			});
		});
		
		it('Should return 204 if do not update an item in the list', (done) => {
			Mock
			.expects('updateOne')
			.withArgs({ _id: "5d00b19fa886171528c5dfc4" }, request)
			.chain('exec')
			.resolves({ n: 1,
					    nModified: 0,
					    ok: 1 });
						
			agent
			.put('/listings/5d00b19fa886171528c5dfc4')
			.send(request)
			.end((err, res) => {
				expect(res.status).to.equal(204);
				done();
			});
		})
	});
	
	describe('listings.delete', () => {
		it('Should delete an item from the listing', (done) => {
			Mock
			.expects('findOneAndDelete')
			.withArgs({ _id: "5d00b19fa886171528c5dfc4" })
			.chain('exec')
			.resolves({});
			
			agent
			.delete('/listings/5d00b19fa886171528c5dfc4')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body).to.eql({});
				done();
			})
		});
	});
});