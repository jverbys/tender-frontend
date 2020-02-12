var app = angular.module('tenderApp', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/tenders', {
                controller: 'TenderListController',
                templateUrl: 'views/tenders/index.html'
            })
        .when('/tenders/create', {
                controller: 'TenderCreateController',
                templateUrl: 'views/tenders/create.html'
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
    
    factory.getTenderListFromPageUrl = function (url) {
        return $http.get(url);
    }

    factory.getTender = function () {
        return $http.get('http://localhost:8000/api/tenders/' + $routeParams.tenderId);
    }

    factory.createTender = function(data) {
        return $http.post('http://localhost:8000/api/tenders/', data);
    }

    factory.updateTender = function (data) {
        return $http.patch('http://localhost:8000/api/tenders/' + $routeParams.tenderId, data);
    }

    factory.deleteTender = function () {
        return $http.delete('http://localhost:8000/api/tenders/' + $routeParams.tenderId);
    }
    
    return factory;
});

var controllers = {};
controllers.TenderListController = function($scope, tendersFactory, $location) {
    tendersFactory.getTenderList()
        .then(function success(response) {
            $scope.tenders = response.data.data;
            $scope.links = response.data.links;
            $scope.meta = response.data.meta;
        }, function error(response) {
            console.log(response);
        });

    $scope.showTender = function(tender) {
        $location.path(tender.links.self);
    };

    $scope.changeListPage = function(url) {
        tendersFactory.getTenderListFromPageUrl(url)
            .then(function success(response) {
                $scope.tenders = response.data.data;
                $scope.links = response.data.links;
                $scope.meta = response.data.meta;
            }, function error(response) {
                console.log(response);
            });
    };
}
controllers.TenderShowController = function($scope, tendersFactory, $location) {
    tendersFactory.getTender()
        .then(function success(response) {
            $scope.tender = response.data;
        }, function error(response) {
            console.log(response);
        });

    $scope.deleteTender = function() {
        tendersFactory.deleteTender()
            .then(function success(response) {
                $location.path('/tenders/');
                alert('Deleted');
            }, function error(response) {
                console.log(response);
            });
    }

    $scope.updateTender = function(data) {
        title = data.title;
        description = data.description;
        tendersFactory.updateTender({title, description})
            .then(function success(response) {
                $scope.tender = response.data;
                alert('updated');
            }, function error(response) {
                console.log(response);
            });
    }
}
controllers.TenderCreateController = function ($scope, tendersFactory, $location) {
    $scope.createTender = function(data) {
        tendersFactory.createTender(data)
            .then(function success(response) {
                $location.path(response.data.links.self);
                alert('created');
            }, function (response) {
                console.log(response);
            });
    }
}


app.controller(controllers);