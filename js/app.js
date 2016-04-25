/* jslint browser: true */
/* jslint esnext: true */

var angular = require('angular');
var angularRoute = require('angular-route');
var app = angular.module('MarvelSuperHeroApp', ['ngRoute']);

/*The AngularJS router below.*/
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/list', {
            controller: 'ListViewController',
            templateUrl: 'sections/list-view.html',
        })
        .when('/detail/:hero_number', {
            controller: 'DetailViewController',
            templateUrl: 'sections/detail-view.html',
        })
        .when('/event/:event_number', {
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
    $scope.heroes = CurrentHero.getHeroes();

    /*This is run when clicked*/
    $scope.getDetails = function (hero) {
        console.log("clicked on " + hero.name);
        console.log(CurrentHero.checkID());
        CurrentHero.setCurrent(hero);
    };
    $scope.search = '';
}]);

/*The view for the specifc list of a heroes' events*/
app.controller('DetailViewController', ['$scope', '$http', 'CurrentHero', '$routeParams', function ($scope, $http, CurrentHero, $routeParams) {
    console.log('DetailView Switched');
    CurrentHero.eventsAjax($http);
    $scope.events = CurrentHero.getEvents();
    $scope.current = CurrentHero.getCurrent();
}]);

/*The view for the event details.*/
app.controller('EventViewController', ['$scope', '$http', 'CurrentHero', '$routeParams', function ($scope, $http, CurrentHero, $routeParams) {
    console.log('EventViewController Switched');
    //    console.log($routeParams.event_number);
    $scope.eventID = $routeParams.event_number;
    CurrentHero.setEventID($routeParams.event_number);
    CurrentHero.retrieveEventDetail($http);
    CurrentHero.retrieveEventName($http);
    $scope.characters = CurrentHero.getCharacters();
    $scope.eventName = CurrentHero.setEventName();
    /*Not registering the updated name change*/
    $scope.totalEvents = "zero";
    $scope.search = '';

    console.log('$scope.characters');
    console.log($scope.characters);

    $scope.newHero = function (character) {
        console.log('Running newHero');
        CurrentHero.setCurrent(character);
    };

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

    /* eventDetail is where I will store data identifying the current event.
    It should be filled when an event is clicked on in the detail view.*/

    var eventDetailID = [];
    var eventDetail = {
        name: 'default',
    };
    var eventDetailCharacters = [];

    /*Initial AJAX request*/
    $http({
        method: 'get',
        //        My API
        url: 'http://gateway.marvel.com:80/v1/public/characters?limit=100&apikey=0e7466623241b56d92fc74e4d5039354',
    }).then(function (response) {
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
            console.log('setCurrent is finished.');
        },
        getCurrent: function () {
            return current;
        },
        eventsAjax: function ($http) {
            $http({
                method: 'get',
                url: 'http://gateway.marvel.com:80/v1/public/characters/' + current.id + '/events?orderBy=-name&limit=8&apikey=0e7466623241b56d92fc74e4d5039354',
            }).then(function (response) {
                angular.copy(response.data.data.results, events);
                return response;
            });
        },
        getEvents: function () {
            return events;
        },
        checkID: function () {
            return current.id;
        },
        setEventID: function (id) {
            eventDetailID = id;
        },
        retrieveEventDetail: function ($http) {
            console.log('Retrieving event information!');
            $http({
                method: 'get',
                url: 'http://gateway.marvel.com:80/v1/public/events/' + eventDetailID + '/characters?apikey=0e7466623241b56d92fc74e4d5039354',
            }).then(function (response) {
                //                console.log('response is');
                //                console.log(response.data.data.results);
                angular.copy(response.data.data.results, eventDetailCharacters);
                console.log('eventDetailCharacters should be: ');
                console.log(eventDetailCharacters);
            });
        },
        getCharacters: function () {
            return eventDetailCharacters;
        },
        retrieveEventName: function ($http) {
            console.log('Retrieving name of the event');
            $http({
                method: 'get',
                url: 'http://gateway.marvel.com:80/v1/public/events/' + eventDetailID +
                    '?apikey=0e7466623241b56d92fc74e4d5039354'
            }).then(function (response) {
                console.log('Before updating the variable');
                console.log(response.data.data.results[0].title);
                //                eventDetail.name = response.data.data.results[0].title;
                //                angular.copy(response.data.data.results.title, eventDetail.name);
                console.log('After updating the variable: ');
                console.log(eventDetail.name);
            });
        },
        setEventName: function () {
            return eventDetail.name;
        },
        setTotalEvents: function () {
            return "hello";
        },
        sendHero: function (data) {
            console.log(data);
        }
    };


});
