angular.module('app', [])

	.factory('UUID', function () {
		// Algoritmo extraido de http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript 
		return {
			nuevo: 	function () {
						var fecha = new Date().getTime(),
							uuid  = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
									function(c) {
										var r = (fecha + Math.random()*16)%16 | 0;
										return (c=='x' ? r : (r&0x7|0x8)).toString(16);
									});
						return uuid;																	
					}
		};
	})

	.controller('ctl', function ($scope, UUID) {
		$scope.listaUUIDs = [];

		$scope.nuevoUUID = function() {
			$scope.listaUUIDs.unshift(UUID.nuevo());
		};

	})

	.directive('layout', function($window) {
		return function(scope, elemento, atributos) {
			scope.margen = elemento.attr("margen") || 8;

			scope.dimensionesVentana  = function() {
				
				scope.altoVentana     = $window.innerHeight;
				scope.anchoVentana    = $window.innerWidth;
				
				scope.nuevoSuperior   = scope.margen + 'px';
				scope.nuevoInferior   = (scope.altoVentana - scope.margen - scope.altoNuevo) + 'px';
				scope.nuevoDerecha    = scope.margen + 'px';
				scope.nuevoIzquierda  = (((scope.anchoVentana - scope.margen * 3) / 2) + (scope.margen * 2)) + 'px';

				scope.listaSuperior   = scope.margen + 'px';
				scope.listaInferior   = scope.margen + 'px';
				scope.listaDerecha    = (((scope.anchoVentana - scope.margen * 3) / 2) + (scope.margen * 2)) + 'px';
				scope.listaIzquierda  = scope.margen + 'px';
				scope.listaAltoLista  = (scope.altoVentana - (scope.margen * 3) - 88) + 'px';
				
			};

			scope.dimensionesVentana();

			return angular.element($window).bind('resize', function() {
				scope.dimensionesVentana();
				return scope.$apply();
			});
		};
	});
