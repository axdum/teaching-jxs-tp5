var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.controller('poke', function ($scope, $log, $http) {
    /*
    $scope.pokemonslist = [
        {id : 0, name : "Bulbizarre" },
        {id : 1, name : "Herbizarre" },
        {id : 2, name : "Florizarre" },
        {id : 3, name : "Salameche" },
        {id : 4, name : "Reptincel" },
        {id : 5, name : "Dracaufeu" },
        {id : 6, name : "Carapuce" },
        {id : 7, name : "Carabaffe" },
        {id : 8, name : "Tortank" }
    ];*/
    $scope.$log = $log;
    $http.get('https://pokeapi.co/api/v2/pokemon/?limit=950').then(function success(response) {
        $scope.pokemonslist = response.data.results;
    }, function error(response) {
        console.log(response.message);
    });
});

pokeApp.factory('getPokeInfos',  ['$resource',function($resource){
    return $resource('https://pokeapi.co/api/v2/pokemon/:id');
}]);

