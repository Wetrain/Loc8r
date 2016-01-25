var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationsListByDistance = function(re, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsCreate = function(req, res) {
    sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsReadOne = function(req, res) {
    if(req.params && req.params.locationid) {
        Loc
        .findById(req.params.locationid)
        .exec(function(err, location) {
            if(!location) {
                sendJsonResponse(res, 404, {"message": "location not found"});
                return
            } else if (err) {
                sendJsonResponse(res, 404, err);
            }
            sendJsonResponse(res, 200, location); 
        });
    } else {
        sendJsonResponse(res, 404, {"message": "No locationID in req"});
    }
};

module.exports.locationsUpdateOne = function(req, res) {
};

module.exports.locationsDeleteOne = function(req, res) {
};
