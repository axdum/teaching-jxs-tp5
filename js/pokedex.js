var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

// Services
pokeApp.factory('getPokeInfosById',  function($resource){
	return $resource('https://pokeapi.co/api/v2/pokemon/:id');
});

pokeApp.factory('getPokeInfosByName',  function($resource){
	return $resource('https://pokeapi.co/api/v2/pokemon/:name');
});

pokeApp.factory('SharedService', function() {
	var service = { id:'1',name: 'bulbasaur'};
	return service;
});

pokeApp.controller('poke', function ($scope, $log, $http, SharedService) {
	$scope.$log = $log;
	$http.get('https://pokeapi.co/api/v2/pokemon/?limit=50').then(function success(response) {
		console.log('Pokémons chargés !');
		$scope.pokemonslist = response.data.results;
	}, function error(response) {
		console.log(response.message);
	});

	$scope.update=function(name){
		SharedService.name=name;
		console.log('SharedService update :' + name);
	}
});

pokeApp.controller('details', function ($scope, $log, getPokeInfosByName, SharedService){
	function search(){
		console.log('Search :' + SharedService.name);
		$scope.img = './img/pok.gif';
		getPokeInfosByName.get({name: SharedService.name}, function(data){
			console.log('Pokémon trouvé !');
			$scope.id = data.id;
			$scope.name = data.name;
			$scope.img = data.sprites.front_default;
			$scope.abilities = data.abilities;
			$scope.stats = data.stats;
			$scope.weight = Math.round((data.weight*0.1) * 10 ) / 10;
			$scope.height = Math.round((data.height*0.1) * 10 ) / 10;
			$scope.moves = data.moves;
			$scope.exp = data.base_experience;
			$scope.types = data.types;
		}, function(){
			console.log('Pokémon non trouvé !');
		});
	};
	$scope.$watch(SharedService.name, search);
});
