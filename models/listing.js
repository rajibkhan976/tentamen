mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
	type: String,
	price: String,
	monthly_fee: String,
	bidding_status: String,
	address: {
		city: String,
		municipality: String,
		street: String,
		geo: {
			lat: Number,
			lng: Number
		}
	}
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;