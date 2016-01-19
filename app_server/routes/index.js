var express = require('express');
var router = express.Router();

/* Controlelrs */
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/* Location Routes */
router.get('/', ctrlLocations.homelist);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* Other Routes */
router.get('/about', ctrlOthers.about);

module.exports = router;
