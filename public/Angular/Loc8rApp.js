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
    return $http.get('/api/locations?lng=0.79&lat=51.3&maxDistance=2000000000000000000000');
};

/* controllers */
var locationsListCtrl = function($scope, loc8rData) {
  //$http returns a promise so we need to call either success or fail
  $scope.meesage = "Searching for locations near by...";
  loc8rData
    .success(function(data) {
        $scope.mesaage = data.length > 0 ? "" : "No locations found =/";
        $scope.data = { locations: data };
    })
      .error(function(error) {
          $scope.message = "Sorry an internal error occured =/";
          console.log(error); 
      });
};


angular
    .module('Loc8rApp')
    .controller('locationsListCtrl', locationsListCtrl)
    .filter('formatDistance', formatDistance)
    .directive('ratingStars', ratingStars)
    .service('loc8rData', loc8rData);