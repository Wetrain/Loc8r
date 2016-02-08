angular.module('Loc8rApp', []);

var locationsListCtrl = function($scope) {
  $scope.data = {
      locations: [{
        name: 'Burger Queen',
        address: '283 st amrys road',
        rating: 3,
        facilities: ['Drinks', 'cakes','wifi'],
        distance: '0.7865456',
        _id: '5370a35f2'  
        },{
        name: 'Burger Queen 2',
        address: '284 st amrys road',
        rating: 4,
        facilities: ['Drinks', 'cakes','wifi'],
        distance: '0.7865467',
        _id: '5370a35f3' 
    }]};
};

angular
    .module('Loc8rApp')
    .controller('locationsListCtrl', locationsListCtrl);