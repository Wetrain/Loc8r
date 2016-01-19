/* GET */
module.exports.homelist = function(req, res) {
    res.render('locations-list', { title: 'Locations:' });
};

module.exports.locationInfo = function(req, res) {
    res.render('index', { title: 'location info bro' });
};

module.exports.addReview = function(req, res) {
    res.render('index', { title: 'Add review' });
};