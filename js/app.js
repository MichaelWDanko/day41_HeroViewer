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
//                url: "http://gateway.marvel.com:80/v1/public/characters/" + hero.id + "/events?orderBy=-name&limit=5&apikey=0e7466623241b56d92fc74e4d5039354",
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
        });
}]);

/*The view for the general list of heroes*/
app.controller('ListViewController', ['$scope', '$http', 'CurrentHero', '$route', function ($scope, $http, CurrentHero, $route) {

    //    console.log('ListView Switched');

    $scope.heroes = CurrentHero.getHeroes();
    
    /*This is run when clicked*/
    $scope.getDetails = function (hero) {
        CurrentHero.setCurrent(hero);
        console.log("clicked on " + hero.name);
        console.log(CurrentHero.checkID());
    };
}]);

/*The view for the specifc list of a heroes' events*/
app.controller('DetailViewController', ['$scope', '$http', 'CurrentHero', function ($scope, $http, CurrentHero) {
    //    console.log('DetailView Switched');
    
    CurrentHero.eventsAjax();
    $scope.events = CurrentHero.getEvents();
$scope.current = CurrentHero.getCurrent();
}]);

/*The factory to create the CurrentHero service.*/
app.factory('CurrentHero', function ($http, $route) {
    var name = '';
    var heroes = [];
    var current = {
        name: '',
        url: '',
        id: '',
    };
    var giraffe = '';
    var events = [];

    $http({
        method: 'get',
        url: 'https://gateway.marvel.com:443/v1/public/characters?limit=50&offset=500&apikey=0e7466623241b56d92fc74e4d5039354',
    }).then(function (response) {
        console.log('Heroes array before');
        console.log(heroes);
        heroes = response.data.data.results;
        console.log('Heroes array after');
        console.log(heroes);

    }).then(function () {
        $route.reload();
    });
    /*^^Feels extremely hacky^^*/


    return {
        getHeroes: function () {
            return heroes;
        },
        setCurrent: function (hero) {
            current.name = hero.name;
            current.id = hero.id;
            current.url = (hero.thumbnail.path + '/landscape_incredible.' + hero.thumbnail.extension);
            console.log(current.id);
        },
        getCurrent: function () {
            return current;
        },
        eventsAjax: function () {
            
            $http({
                method: 'get',
                url: "http://gateway.marvel.com:80/v1/public/characters/" + current.id + "/events?orderBy=-name&limit=5&apikey=0e7466623241b56d92fc74e4d5039354",
            }).then(function (response) {
                events = response.data.data.results;
                return response;
            });
        },
        getEvents: function () {
            console.log(events);
            return events;
        },
        checkID: function () {
            return current.id;
        },

    };

});
