"use strict";

var app = angular.module('Snake', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'partials/Main.html',
			controller: 'SnakeCtrl',
		})
		.otherwise('/home');
})

.run(() => console.log("App is running"));
