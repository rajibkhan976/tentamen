get = (req, res, next) => {
  req.models.Listing.find().then((listings) => {
      return res.send(listings);
    }).catch((error) => next(error))
}

addToListing = (req, res, next) => {
	req.models.Listing.create({
		type: req.body.type,
		price: req.body.price,
		monthly_fee: req.body.monthly_fee,
		bidding_status: req.body.bidding_status,
		address: {
			city: req.body.address.city,
			municipality: req.body.address.municipality,
			street: req.body.address.street,
			geo: {
				lat: req.body.address.geo.lat,
				lng: req.body.address.geo.lng
			}
		}
	}).then((listing) => {
		return res.status(201).send(listing);
	}).catch((error) => {
		next(error);
	})
}

module.exports = {
  get,
  addToListing
}