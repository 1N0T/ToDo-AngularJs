angular.module('app', ["html5.sortable", "ngSanitize", "ui.tinymce"])

	.factory('almacenamientoLocal', function () {
		var STORAGE_ID = 'misTareas';

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
		$scope.tipoActual        = "pendientes";
		$scope.tareasActivas     = almacenamientoLocal.get("activas");
		$scope.tareasPendientes  = almacenamientoLocal.get("pendientes");
		$scope.tareasFinalizadas = almacenamientoLocal.get("finalizadas");

		$scope.opcionesTinymce = {
			plugins: "image, link, print",
			toolbar: "bold italic underline |  aligncenter alignjustify  | bullist numlist outdent indent | link | print ",
			menubar: true,
			statusbar: false,
			resize: true
		};

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

		$scope.borrarTarea = function () {
			switch ($scope.tipoActual) {
				case "pendientes":
					$scope.tareasPendientes.splice($scope.indiceActual, 1);
					almacenamientoLocal.put("pendientes", $scope.tareasPendientes);
					break;
				case "activas":
					$scope.tareasActivas.splice($scope.indiceActual, 1);
					almacenamientoLocal.put("activas", $scope.tareasActivas);
					break;
				case "finalizadas":
					$scope.tareasFinalizadas.splice($scope.indiceActual, 1);
					almacenamientoLocal.put("finalizadas", $scope.tareasFinalizadas);
					break;
			};
			$scope.tarea = "";
			$scope.modo  = "añadir";
		};

		$scope.seleccionarTarea = function (accion, tipo, indice ) {
			$scope.modo         = accion;
			$scope.indiceActual = indice;
			$scope.tipoActual   = tipo;
			switch (tipo) {
				case "pendientes":
					$scope.tarea = $scope.tareasPendientes[indice].tarea;
					break;
				case "activas":
					$scope.tarea = $scope.tareasActivas[indice].tarea;
					break;
				case "finalizadas":
					$scope.tarea = $scope.tareasFinalizadas[indice].tarea;
					break;
				default:
					$scope.tarea = "";
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
				case "borrar":
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

