const express = require('express')
const router = express.Router()

const listing = require('./listing.js')

router.get("/listings", listing.get)
router.post("/listings", listing.addToListing);
router.patch("/listings/:id", listing.updateListingById);
router.delete("/listings/:id", listing.deleteListingById);

module.exports = router