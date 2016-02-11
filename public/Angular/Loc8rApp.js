angular.module('Loc8rApp', []);

/* helper functions */
var _isNumeric = function(distance) {
    return !isNaN(parseFloat(distance) && isFinite(distance)); 
};

var formatDistance = function() {
    //format km into miles 
    return function(distance) {
        var numDistance, unit;
        if(distance && _isNumeric(distance)) {    
            if(distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            } else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }
            return numDistance + unit;
        } else {
            return "dah fuk?";
        }
    };
};

/*directives */
var ratingStars = function() {
    return {
        scope: {
            thisRating: '=rating'
        },
        templateUrl: "/Angular/angular-directives/star-rating.html"
    };
};

/* services */
var loc8rData = function($http) {
    var locationByCoords = function(lat, lng) {
        return $http.get('/api/locations?lng='+lng+'&lat='+lat+'&maxDistance=2000000000000000000');
    };
    return { locationByCoords : locationByCoords };
};

var geoLocation = function() {
    var getPosition = function(cbSuccess, cbError, cbNoGeo) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
        } else {
            cbNoGeo();
        }
    };
    return {
        getPosition : getPosition
    };
};

/* controllers */
var locationsListCtrl = function($scope, loc8rData, geoLocation) {
  //$http returns a promise so we need to call either success or fail
  $scope.meesage = "Getting your current location..";
  
  $scope.getData = function(position) {
    console.log('called');
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    $scope.message = "Checking for Cafes nearby..";  
    loc8rData.locationByCoords(lat, lng)
    .success(function(data) {
        $scope.mesaage = data.length > 0 ? "" : "No locations found =/";
        $scope.data = { locations: data };
    })
        .error(function(error) {
            $scope.message = "Sorry an internal error occured =/";
            console.log(error); 
    });
  };
    
   $scope.showError = function(error) {
       $scope.apply(function() {
          $scope.message = error.message; 
       });
   };
   
   $scope.noGeo = function() {
       $scope.apply(function() {
          $scope.message = "Sorry your browser does not location awareness"; 
       });
   };
   
   $scope.refreshData = function() {
        geoLocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
   };
   
   $scope.refreshData();
};


angular
    .module('Loc8rApp')
    .controller('locationsListCtrl', locationsListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('loc8rData', loc8rData)
    .service('geoLocation', geoLocation);