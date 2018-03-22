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

// Get Desc by Id.
pokeApp.factory('getPokeDescById', function ($resource, POKEAPI) {
    return $resource(POKEAPI + '/api/v2/characteristic/:id');
});

// Shared service, pokemon to search .
pokeApp.factory('SharedService', function () {
    var service = {pokemon: '', desc: ''};
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
pokeApp.controller('poke', function ($scope, $log, $http, getPokeInfosByName, getPokeDescById, SharedService, POKEAPI) {

    function getPokemonInfos() {
        $scope.pokemon = getPokeInfosByName.get({name: $scope.selectedPokemon}, function () {
            SharedService.pokemon = $scope.pokemon;
            $scope.desc = getPokeDescById.get({id: $scope.pokemon.id}, function () {
                SharedService.desc = $scope.desc.descriptions[1].description;
            })
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

    $scope.$watch('SharedService.pokemon', function (newInfos) {
        //$log.log('display Details :' + JSON.stringify(poke, null, 4));
        if (newInfos != '') {
            $scope.img = './img/pok.gif';
            $scope.id = newInfos.id;
            $scope.name = newInfos.name;
            $scope.img = newInfos.sprites.front_default;
            $scope.abilities = newInfos.abilities;
            $scope.stats = newInfos.stats;
            $scope.weight = Math.round((newInfos.weight * 0.1) * 10) / 10;
            $scope.height = Math.round((newInfos.height * 0.1) * 10) / 10;
            $scope.moves = newInfos.moves;
            $scope.exp = newInfos.base_experience;
            $scope.types = newInfos.types;
        }
        $log.log('Details de ' + newInfos.name + ' chargés !');
    });

    $scope.$watch('SharedService.desc', function (newDesc) {
        if (newDesc != '') {
            // 0 : fr, 1 : en
            $scope.description = newDesc;
            $log.log('Desc chargée !');
        }
    });
});
