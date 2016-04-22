/* jslint browser: true */
/* jslint esnext: true */

//app.controller('ListViewController2', function ($scope, $http) {
//    //    $scope.name = 'Mike';
//    //    $scope.heroes = [];
//    //    $scope.current = {
//    //        name: '',
//    //        url: '',
//    //        id: '',
//    //    };
//    //    $scope.giraffe = '';
//    //    $scope.events = [];
//    //    $scope.getDetails = function (hero) {
//    //        console.log('Clicked on ' + hero.name + ' who has the ID: ' + hero.id);
//    //        $scope.current.name = hero.name;
//    //        $scope.current.url = (hero.thumbnail.path + '/landscape_incredible.' + hero.thumbnail.extension);
//    //        $scope.current.id = hero.id;
//            $http({
//                method: 'get',
//               "http://gateway.marvel.com:80/v1/public/characters/" + hero.id + "/events?orderBy=-name&limit=5&apikey=0e7466623241b56d92fc74e4d5039354",
//              "http://gateway.marvel.com:80/v1/public/characters/" + current.id + "/events?orderBy=-name&limit=5&apikey=0e7466623241b56d92fc74e4d5039354'
//            }).then(function (response) {
//               $scope.events = response.data.data.results;
//                console.log('events =');
//                console.log($scope.events);
//                return response;
//            });
//    //    };
//


var angular = require('angular');
var angularRoute = require('angular-route');
var app = angular.module('MarvelSuperHeroApp', ['ngRoute']);

/*The AngularJS router below.*/
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/list', {
            controller: 'ListViewController',
            templateUrl: 'sections/list-view.html',
            //            resolve: 'ListViewController.resolve'
        })
        .when('/detail', {
            controller: 'DetailViewController',
            templateUrl: 'sections/detail-view.html',
            //        resolve: 'DetailViewController.resolve'
        })
        .when('/event', {
            controller: 'EventViewController',
            templateUrl: 'sections/event-view.html',
        }).otherwise({
            controller: 'ListViewController',
            templateUrl: 'sections/list-view.html',
        });
}]);

/*The view for the general list of heroes*/
app.controller('ListViewController', ['$scope', '$http', 'CurrentHero', function ($scope, $http, CurrentHero) {
    console.log('ListView Switched');
    
//    setTimeout(function () {
//        $scope.hithere = 'hello';
//        $scope.heroes = CurrentHero.getHeroes();
//        console.log('loading ' + $scope.heroes.length + ' heroes')
////        console.log(CurrentHero.getHeroes());
//    }, 1000);
//        $scope.heroes = CurrentHero.getHeroes();

    $scope.hithere = 'good day';
    $scope.heroes = CurrentHero.getHeroes();
    
    /*This is run when clicked*/
    $scope.getDetails = function (hero) {
        console.log("clicked on " + hero.name);
        console.log(CurrentHero.checkID());
        CurrentHero.setCurrent(hero);
    };
}]);

/*The view for the specifc list of a heroes' events*/
app.controller('DetailViewController', ['$scope', '$http', 'CurrentHero', function ($scope, $http, CurrentHero) {
    console.log('DetailView Switched');
    console.log(CurrentHero.checkID());
    //    CurrentHero.eventsAjax();
    CurrentHero.eventsAjax($http);
    $scope.events = CurrentHero.getEvents();
    $scope.current = CurrentHero.getCurrent();
}]);

/*The view for the event details.*/
app.controller('EventViewController', ['$scope', '$http', 'CurrentHero', function ($scope, $http, CurrentHero) {
    console.log('EventViewController Switched');
}]);

/*The factory to create the CurrentHero service.*/
app.factory('CurrentHero', function ($http) {
    var name = '';
    var heroes = [];
    var current = {
        name: '',
        url: '',
        id: '',
    };
    var events = [];

    /*Initial AJAX request*/
    $http({
        method: 'get',
        //        My API
        url: 'http://gateway.marvel.com:80/v1/public/characters?limit=10&apikey=0e7466623241b56d92fc74e4d5039354',
        //                                                                                          0e7466623241b56d92fc74e4d5039354        
        //        Luke's API
        //        url: 'http://gateway.marvel.com:80/v1/public/characters?limit=10&offset=500&apikey=ea904943b774d2e0bf732697141a07da',
    }).then(function (response) {
//        for (let result of response.data.data.results) {
//            heroes.push(result);
//        }
        angular.copy(response.data.data.results, heroes);
    });

    return {
        getHeroes: function () {
            return heroes;
        },
        setCurrent: function (hero) {
            current.name = hero.name;
            current.id = hero.id;
            current.url = (hero.thumbnail.path + '/landscape_incredible.' + hero.thumbnail.extension);
            console.log('setCurrent is finished.')
        },
        getCurrent: function () {
            return current;
        },
        eventsAjax: function ($http) {
            console.log('eventsAjax start');
            console.log(current.id);
            $http({
                method: 'get',
                url: 'http://gateway.marvel.com:80/v1/public/characters/' + current.id + '/events?orderBy=-name&limit=5&apikey=0e7466623241b56d92fc74e4d5039354',
            }).then(function (response) {
                angular.copy(response.data.data.results, events);
                console.log(events);
//                console.log('AJAX part2');
//                console.log(response);
//                events = response.data.data.results;
//                console.log(events);
                return response;
            });
        },
        getEvents: function () {
            console.log('events =');
            console.log(events);
            return events;
        },
        checkID: function () {
            return current.id;
        },

    };

});
