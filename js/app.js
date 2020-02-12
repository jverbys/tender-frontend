var app = angular.module('tenderApp', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/tenders', {
                controller: 'TenderListController',
                templateUrl: 'views/tenders/index.html'
            })
        .when('/tenders/:tenderId', {
                controller: 'TenderShowController',
                templateUrl: 'views/tenders/show.html'
            })
        .otherwise({ redirectTo: '/tenders' });

    //$locationProvider.html5Mode(true);
});

app.factory('tendersFactory', function ($http, $routeParams) {
    var factory = {};

    factory.getTenderList = function () {
        return $http.get('http://localhost:8000/api/tenders');
    }

    factory.getTender = function () {
        return $http.get('http://localhost:8000/api/tenders/' + $routeParams.tenderId);
    }
    
    return factory;
});

var controllers = {};
controllers.TenderListController = function($scope, tendersFactory, $location) {
    tendersFactory.getTenderList()
        .then(function success(response) {
            $scope.tenders = response.data.data;
        }, function error(response) {
            console.log(response);
        });

    $scope.showTender = function(tender) {
        $location.path(tender.links.self);
    };
}
controllers.TenderShowController = function($scope, tendersFactory) {
    tendersFactory.getTender()
        .then(function success(response) {
            $scope.tender = response.data;
        }, function error(response) {
            console.log(response);
        });
}


app.controller(controllers);