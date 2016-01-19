/* GET */
module.exports.homelist = function(req, res) {
    res.render('locations-list', { title: 'Locations:' });
};

module.exports.locationInfo = function(req, res) {
    res.render('location-info', { title: 'location info bro' });
};

module.exports.addReview = function(req, res) {
    res.render('location-review-form', { title: 'Add review' });
};