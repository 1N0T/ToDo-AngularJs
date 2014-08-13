angular.module('app', ["html5.sortable", "ngSanitize"])

	.factory('almacenamientoLocal', function () {
		var STORAGE_ID = 'misTareas';
		// localStorage.clear();

		return {
			get: function (tipo) {
				return JSON.parse(localStorage.getItem(STORAGE_ID + tipo) || '[]');
			},
			put: function (tipo, tareas) {
				localStorage.setItem(STORAGE_ID + tipo, JSON.stringify(tareas));
			}
		};
	})

	.controller('ctl', function ($window, $scope, almacenamientoLocal, filterFilter) {
		$scope.modo              = "añadir";
		$scope.indiceActual      = 0;
		$scope.tareasActivas     = almacenamientoLocal.get("activas");
		$scope.tareasPendientes  = almacenamientoLocal.get("pendientes");
		$scope.tareasFinalizadas = almacenamientoLocal.get("finalizadas");

		$scope.nuevaTarea = function ( tarea ) {
			if (tarea.trim().length > 0  && (!$scope.tareaDuplicada( tarea )))  {
				$scope.tareasPendientes.push({"tarea": tarea});
				$scope.tarea = "";
				almacenamientoLocal.put("pendientes", $scope.tareasPendientes);
			};
		};

		$scope.tareaDuplicada = function ( tarea ) {
			var duplicadasPendientes  = filterFilter($scope.tareasPendientes, {"tarea": tarea}, true);
			var duplicadasActivas     = filterFilter($scope.tareasActivas, {"tarea": tarea}, true);
			var duplicadasFinalizadas = filterFilter($scope.tareasFinalizadas, {"tarea": tarea}, true);
			return duplicadasPendientes.length + duplicadasActivas.length + duplicadasFinalizadas.length;
		};

		$scope.borrarTarea = function ( tipo, indice ) {
			if (tipo == "activas") {
				$scope.tareasActivas.splice(indice,1);
				almacenamientoLocal.put("activas", $scope.tareasActivas);
			};
			if (tipo == "pendientes") {
				$scope.tareasPendientes.splice(indice,1);
				almacenamientoLocal.put("pendientes", $scope.tareasPendientes);
			};
			if (tipo == "finalizadas") {
				$scope.tareasFinalizadas.splice(indice,1);
				almacenamientoLocal.put("finalizadas", $scope.tareasFinalizadas);
			};
		};

		$scope.seleccionarTarea = function ( tipo, indice ) {
			if (tipo == "pendientes") {
				$scope.modo  = "editar";
				$scope.indiceActual = indice;
				$scope.tarea = $scope.tareasPendientes[indice].tarea;
			};
		};

		$scope.modificarTarea = function ( tarea ) {
			$scope.tareasPendientes[$scope.indiceActual].tarea = $scope.tarea;
			$scope.indiceActual = 0;
			$scope.tarea = "";
			$scope.modo  = "añadir";
		};

		$scope.cancelar = function () {
			switch ($scope.modo) {
				case "añadir":
					$scope.tarea = "";
					break;
				case "editar":
					$scope.tarea = "";
					$scope.modo  = "añadir";
					break;
				default:
					$scope.tarea = "";
			};
		};

		$scope.sortable_cross_option = {
			allow_cross: 	true,
			stop:       	function( listaDrop,				// lista destino final
									  indiceDrop,				// posición de destino (indice empieza por 0)
									  ngExtraSortableDrop,		// valor de ng-extra-sortable del destino. 
			                          ngExtraSortableDrag) {	// valor de ng-extra-sortable del origen.
			                          
								if ( ngExtraSortableDrop == 'activas') {
									if (ngExtraSortableDrag == 'pendientes') {
										var find_index = $scope.tareasPendientes.indexOf($scope.tareasActivas[indiceDrop]);
										if ( find_index != -1){
										  $scope.tareasPendientes.splice(find_index,1);
										};
									};
									if (ngExtraSortableDrag == 'finalizadas') {
										var find_index = $scope.tareasFinalizadas.indexOf($scope.tareasActivas[indiceDrop]);
										if ( find_index != -1){
										  $scope.tareasFinalizadas.splice(find_index,1);
										};
									};
								};  
								
								if ( ngExtraSortableDrop == 'pendientes') {
									if (ngExtraSortableDrag == 'activas') {
										var find_index = $scope.tareasActivas.indexOf($scope.tareasPendientes[indiceDrop]);
										if ( find_index != -1){
										  $scope.tareasActivas.splice(find_index,1);
										};
									};
									if (ngExtraSortableDrag == 'finalizadas') {
										var find_index = $scope.tareasFinalizadas.indexOf($scope.tareasPendientes[indiceDrop]);
										if ( find_index != -1){
										  $scope.tareasFinalizadas.splice(find_index,1);
										};
									};
								};
								 
								if ( ngExtraSortableDrop == 'finalizadas') {
									if (ngExtraSortableDrag == 'pendientes') {
										var find_index = $scope.tareasPendientes.indexOf($scope.tareasFinalizadas[indiceDrop]);
										if ( find_index != -1){
										  $scope.tareasPendientes.splice(find_index,1);
										};
									};
									if (ngExtraSortableDrag == 'activas') {
										var find_index = $scope.tareasActivas.indexOf($scope.tareasFinalizadas[indiceDrop]);
										if ( find_index != -1){
										  $scope.tareasActivas.splice(find_index,1);
										};
									};
								};  
								// Guardamos todas las posibles modificaciones de las listas de tareas.
								almacenamientoLocal.put("pendientes",  $scope.tareasPendientes);
								almacenamientoLocal.put("activas",     $scope.tareasActivas);
								almacenamientoLocal.put("finalizadas", $scope.tareasFinalizadas);
							}
								   

		}

	})

	.directive('layout', function($window) {
		return function(scope, elemento, atributos) {
			scope.margen      = elemento.attr("margen")         || 8;
		    scope.altoNueva   = elemento.attr("altonueva")      || 175;
		    scope.altoActiva  = elemento.attr("altoactiva")     || 295;

			scope.dimensionesVentana   = function() {
				
				scope.altoVentana          = $window.innerHeight;
				scope.anchoVentana         = $window.innerWidth;
				
				scope.nuevasSuperior       = scope.margen + 'px';
				scope.nuevasInferior       = (scope.altoVentana - scope.margen - scope.altoNueva) + 'px';
				scope.nuevasDerecha        = scope.margen + 'px';
				scope.nuevasIzquierda      = (((scope.anchoVentana - scope.margen * 3) / 2) + (scope.margen * 2)) + 'px';

				scope.activasSuperior      = scope.margen + 'px';
				scope.activasInferior      = (scope.altoVentana - scope.margen - scope.altoActiva) + 'px';
				scope.activasDerecha       = (((scope.anchoVentana - scope.margen * 3) / 2) + (scope.margen * 2)) + 'px';
				scope.activasIzquierda     = scope.margen + 'px';
				scope.activasAltoLista     = (scope.altoActiva - (scope.margen * 2) - 88) + 'px';
				
				scope.pendientesSuperior   = (scope.altoNueva + (scope.margen * 2)) + 'px';
				scope.pendientesInferior   = scope.margen + 'px';
				scope.pendientesDerecha    = scope.margen + 'px';
				scope.pendientesIzquierda  = (((scope.anchoVentana - scope.margen * 3) / 2) + (scope.margen * 2)) + 'px';
				scope.pendientesAltoLista  = (scope.altoVentana - scope.altoNueva - (scope.margen * 3) - 88) + 'px';
				
				scope.finalizadasSuperior  = (scope.altoActiva + (scope.margen * 2)) + 'px';
				scope.finalizadasInferior  = scope.margen + 'px';
				scope.finalizadasDerecha   = (((scope.anchoVentana - scope.margen * 3) / 2) + (scope.margen * 2)) + 'px';
				scope.finalizadasIzquierda = scope.margen + 'px';
				scope.finalizadasAltoLista = (scope.altoVentana - scope.altoActiva - (scope.margen * 3) - 88) + 'px';
			};

			scope.dimensionesVentana();

			return angular.element($window).bind('resize', function() {
				scope.dimensionesVentana();
				return scope.$apply();
			});
		};
	});
