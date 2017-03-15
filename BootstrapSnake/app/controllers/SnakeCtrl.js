"use strict";

app.controller("SnakeCtrl", function($scope, $location, $interval, MovementFactory, GameboardFactory) {
	let s = $scope;
	console.log("I am working");


	//id="row${row}-col${checkbox}   s.gameboard-1 = (14)
	let counter = 0;
	s.pointsToAdd = 10;
	s.gamePoints = 0;
	s.snakePts = [];
	s.target = {};
	s.gameboard = 15;
	let initialDirection = 'left';
	console.log(s.start);

	s.findTarget = (snakePts) => {
		return snakePts === s.target;
	};

	s.generateTarget = () => {
		do {
			s.target = {
				row: Math.floor(Math.random() * s.gameboard),
				col: Math.floor(Math.random() * s.gameboard)
			};						
		} while (s.snakePts.find(s.findTarget) !== undefined);
		console.log(s.target, s.snakePts);
		$( `#row${s.target.row}-col${s.target.col}` ).addClass('target');
		return s.target;
	};


	var stop;
	s.runGame = () => {

		s.start = true;

		if ( angular.isDefined(stop) ) return;
		stop = $interval(function() {		

			let head = s.snakePts.slice(s.snakePts.length - 1, s.snakePts.length)[0];
			//if the box exists
			if ($( `#row${head.row}-col${head.col}` ).hasClass( 'snakebox' )) {

				MovementFactory.move(initialDirection, head).then(
					(newCoordinates) => {

						//if the box is already a part of the snake, stop the fight
						if ($( `#row${newCoordinates.row}-col${newCoordinates.col}` ).hasClass( 'snake' )) {
							alert("You just ran into yourself!!");
							s.stopFight();
						

						//or if the next box is the target, remove class of target, generate a new target, add the class of snake
						//then add it to our snakePts arr
						} else if ($( `#row${newCoordinates.row}-col${newCoordinates.col}` ).hasClass( 'target' )) {
							$( `#row${newCoordinates.row}-col${newCoordinates.col}` ).removeClass( 'target' ).addClass( 'snake' );
							s.snakePts.push(newCoordinates);
							s.generateTarget();
							if (s.snakePts.length % 10 === 0) {
								s.pointsToAdd += 10;
							}
							s.gamePoints += s.pointsToAdd;
							console.log(s.snakePts);

						//Otherwise.. Keep going
						} else {								
							$( `#row${newCoordinates.row}-col${newCoordinates.col}` )
								.addClass( "snake" );
							let tail = s.snakePts.shift();
							$( `#row${tail.row}-col${tail.col}` ).removeClass( "snake" );
							s.snakePts.push(newCoordinates);
							console.log(s.snakePts);								
						}
				}); 								
			} else {
				alert("You're a loser. Check out yo pointssssss");
				s.stopFight();
			}
		}, 200);
	};

	s.stopFight = () => {
		if (angular.isDefined(stop)) {
			$interval.cancel(stop);
			stop = undefined;
			s.start = undefined;			
		}
	};

	s.$on('$destroy', function() {
		s.stopFight();
		s.start = undefined;
	});

	$(document).keydown((event) => {
		if (s.start === true) {
			switch (event.which) {
				case 38: 
					initialDirection = 'up';
					s.stopFight();
					s.runGame();
					break;
				case 37: 
					initialDirection = 'left';
					s.stopFight();
					s.runGame();
					break;
				case 39:
					initialDirection = 'right';
					s.stopFight();
					s.runGame();
					break;
				case 40: 
					initialDirection = 'down';
					s.stopFight();
					s.runGame();
					break;
			}			
		}
	});

	
	s.startGame = () => {
		$( ".snakeContainer" ).remove();
		s.pointsToAdd = 10;
		s.gamePoints = 0;
		s.snakePts = [];
		s.target = {};
		initialDirection = 'left';
		GameboardFactory.setupGameboard(s.gameboard).then(
			() => {
				$( ".row:last-child .snakebox:last-child" ).addClass( "snake" );
				console.log("Start");
				let currentCoordinate = {row: s.gameboard - 1, col: s.gameboard - 1};
				s.snakePts.push(currentCoordinate);
				s.generateTarget();				
				console.log(s.snakePts);
				console.log(s.start);				
				s.runGame();});
	};




});









