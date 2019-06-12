const express = require('express')
const router = express.Router()

const listing = require('./listing.js')

router.get("/listings", listing.get)
router.post("/listings", listing.addToListing);

module.exports = router