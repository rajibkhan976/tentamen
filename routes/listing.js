get = (req, res, next) => {
	var searchQuery;
	if (req.query.type) {
		searchQuery = req.models.Listing.findOne({type: req.query.type});
	} else {
		searchQuery = req.models.Listing.find();
	}
	  searchQuery.exec().then((listings) => {
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

updateListingById = (req, res, next) => {
	req.models.Listing.updateOne({_id: req.params.id}, {
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
	}, {
		new: true,
		upsert: true,
		runvalidators: true
	}).then((status) => {
		if (status.upserted) {
			res.status(201);
		} else if (status.nModified) {
			res.status(200);
		} else {
			res.status(204);
		}
		res.send();
	}).catch((error) => {
		next(error);
	})
}

deleteListingById = (req, res, next) => {
	req.models.Listing.findByIdAndDelete(req.params.id)
	.then((deleted) => {
		if (deleted) {
			return res.send(deleted).status(200);
		}
		res.sendStatus(204);
	})
	.catch((error) => {
		next(error);
	})
}

module.exports = {
  get,
  addToListing,
  updateListingById,
  deleteListingById
}