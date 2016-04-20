/* jslint browser: true */
/* jslint esnext: true */
var angular = require('angular');
var mainApp = angular.module('MarvelSuperHeroApp', []);

mainApp.controller('MainController', function ($scope, $http) {
    $scope.name = 'Mike';
    $scope.heroes = [];
    $scope.current = {
        name: '',
        url: '',
        id: '',
    };
    $scope.giraffe = '';
    $scope.events = [];
    $scope.getDetails = function (hero) {
        console.log('Clicked on ' + hero.name + ' who has the ID: ' + hero.id);
        $scope.current.name = hero.name;
        $scope.current.url = (hero.thumbnail.path + '/landscape_incredible.' + hero.thumbnail.extension);
        $scope.current.id = hero.id;
        $http({
            method: 'get',
            url: "http://gateway.marvel.com:80/v1/public/characters/" + hero.id + "/events?orderBy=-name&limit=5&apikey=0e7466623241b56d92fc74e4d5039354",
        }).then(function (response) {
           $scope.events = response.data.data.results;
            console.log('events =');
            console.log($scope.events);
            return response;
        });
    };

    $http({
        method: 'get',
        url: 'https://gateway.marvel.com:443/v1/public/characters?limit=100&offset=500&apikey=0e7466623241b56d92fc74e4d5039354',
    }).then(function (response) {
        console.log(response.data.data.results);
        $scope.heroes = response.data.data.results;
    });
});

