var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

//ES5 Class, methods for calculating distance on a sphere
var theEarth = (function() {
    var earthRadius = 6371 //km
    
    var getDistanceFromRads = function(rads) {
        return parseFloat(rads * earthRadius);
    };
    
    var getRadsFromDistance = function(distance) {
        return parseFloat(distance / earthRadius);  
    };
    
    return {
        getDistanceFromRads : getDistanceFromRads,
        getRadsFromDistance : getRadsFromDistance
    };    
})();

var parseLocations = function(res) {
    var locations = [];
    res.forEach(function(doc) {
       locations.push({
          distance: theEarth.getDistanceFromRads(doc.dis),
          name:doc.obj.name,
          address: doc.obj.address,
          rating: doc.obj.rating,
          facilities: doc.obj.facilities,
          _id: doc.obj._id 
       });
    });
    return locations;
};

module.exports.locationsListByDistance = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseFloat(req.query.maxDistance);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(maxDistance),
        num: 10
    };
    if(!lng && lng !== 0 || !lat && lat !== 0) {
        sendJsonResponse(res, 404, {"message": "lng and lat needed"});
        return;
    }
    Loc.geoNear(point, geoOptions, function(err, results, stats) {
       var locations = parseLocations(results);
       
       if(err) {
           sendJsonResponse(res, 404, err);
       } else {   
           sendJsonResponse(res, 200, locations);
       }
    });
};


/* POST a new location */
/* /api/locations */
module.exports.locationsCreate = function(req, res) {
    Loc.create({
       name: req.body.name,
       address: req.body.address,
       facilities: req.body.facilities.split(","),
       coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
       openingTimes: [{
           days: req.body.opening1,
           opening: req.body.opening1,
           closing: req.body.closing1,
           closed: req.body.closed1,
       }, {
           days: req.body.opening2,
           opening: req.body.opening2,
           closing: req.body.closing2,
           closed: req.body.closed2,
       }]
    }, function(err, location) {
        if(err) {
            console.log(err);
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 200, location);
        }
    });
};

module.exports.locationsReadOne = function(req, res) {
    if(req.params && req.params.locationid) {
        Loc
        .findById(req.params.locationid)
        .exec(function(err, location) {
            if(!location) {
                sendJsonResponse(res, 404, {"message": "location not found"});
                return;
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
  if (!req.params.locationid) {
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid is required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(
      function(err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(",");
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1,
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2,
        }];
        location.save(function(err, location) {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            sendJsonResponse(res, 200, location);
          }
        });
      }
  );
};

module.exports.locationsDeleteOne = function(req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec(
        function(err, location) {
          if (err) {
            console.log(err);
            sendJsonResponse(res, 404, err);
            return;
          }
          console.log("Location id " + locationid + " deleted");
          sendJsonResponse(res, 204, null);
        }
    );
  } else {
    sendJsonResponse(res, 404, {
      "message": "No locationid"});
  }
};


//optional way to delete from the db but process the entry before you delete it
// Loc
//   .findById(locationid)
//   .exec(
//     function (err, location) {
//       // Do something with the document
//       Loc.remove(function(err, location){
//           //confirm success or failure
// });
//     }
//     };
