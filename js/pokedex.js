var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want.
pokeApp.constant('POKEAPI', 'https://pokeapi.co');

// Services
// Get Poke by Id.
/*pokeApp.factory('getPokeInfosById',  function($resource, POKEAPI){
	return $resource(POKEAPI + '/api/v2/pokemon/:id');
});*/

// Get Poke by Name.
pokeApp.factory('getPokeInfosByName', function ($resource, POKEAPI) {
    return $resource(POKEAPI + '/api/v2/pokemon/:name');
});

// Shared service, pokemon to search .
pokeApp.factory('SharedService', function () {
    var service = {pokemon: ''};
    return service;
});

// Directive
// Include pokedex.html.
pokeApp.directive('pokedex', function () {
    return {
        template: '<div ng-include="\'pokedex.html\'"></div>'
    }
});

// Poke Controller: search pokemon.
pokeApp.controller('poke', function ($scope, $log, $http, getPokeInfosByName, SharedService, POKEAPI) {

    function getPokemonInfos() {
        $scope.pokemon = getPokeInfosByName.get({name: $scope.selectedPokemon}, function () {
            SharedService.pokemon = $scope.pokemon;
        });
    }

    $scope.$log = $log;
    $scope.selectedPokemon = 'bulbasaur';

    // load bulbasaur
    getPokemonInfos();

    // Load pokemonlist : modifier la limite pour charger tous les pokemons !
    $http.get(POKEAPI + '/api/v2/pokemon/?limit=949').then(function success(response) {
        console.log('Pokémons chargés !');
        $scope.pokemonslist = response.data.results;
    }, function error(response) {
        $log.log(response.message);
    });

    $scope.go = function () {
        getPokemonInfos();
    }
});

// Details Controller: display pokemon infos.
pokeApp.controller('details', function ($scope, $log, SharedService) {
    $scope.img = './img/pok.gif';
    $scope.SharedService = SharedService;

    function displayDetails(poke) {
        //$log.log('display Details :' + JSON.stringify(poke, null, 4));
        if (poke != '') {
            $scope.img = './img/pok.gif';
            $scope.id = poke.id;
            $scope.name = poke.name;
            $scope.img = poke.sprites.front_default;
            $scope.abilities = poke.abilities;
            $scope.stats = poke.stats;
            $scope.weight = Math.round((poke.weight * 0.1) * 10) / 10;
            $scope.height = Math.round((poke.height * 0.1) * 10) / 10;
            $scope.moves = poke.moves;
            $scope.exp = poke.base_experience;
            $scope.types = poke.types;
        }
    }

    $scope.$watch('SharedService.pokemon', function (newValue) {
        displayDetails(newValue);
        $log.log('Details de ' + newValue.name + ' chargés !');
    });
});
