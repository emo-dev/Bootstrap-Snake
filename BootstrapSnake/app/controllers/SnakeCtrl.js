"use strict";

app.controller("SnakeCtrl", function($scope, $location, $timeout, $interval, MovementFactory, GameboardFactory, StorageFactory) {
	let s = $scope,
	     counter = 0,
	     initialDirection = 'left';	
	     
	s.pointsToAdd = 10;
	s.gamePoints = 0;
	s.snakePts = [];
	s.target = {};
	s.gameboard = 12;
	s.gameboardRange = _.range(143);	
	s.game = false;	
	s.leaderboard = [];

	s.pageLayout = '../../partials/Gameboard.html';

	chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
      });

	s.startGame = () => {		
		s.game = true;
		$( ".snakeContainer" ).remove();
		s.pointsToAdd = 10;
		s.gamePoints = 0;
		s.snakePts = [];
		s.target = {};			
		initialDirection = 'left';

		$timeout(function() {
			GameboardFactory.setupGameboard(s.gameboard).then(
				() => {
					
					$( ".row:last-child .snakebox:last-child" )
						.addClass( "snake" );
					console.log("Start");
					let currentCoordinate = {row: s.gameboard - 1, col: s.gameboard - 1};
					s.snakePts.push(currentCoordinate);
					s.generateTarget();				
					console.log(s.snakePts);
					console.log(s.start);				
					s.runGame();
				}
			);			
		});
	};
	
	s.generateTarget = () => {

		let findTarget = (snakePts) => snakePts === s.target;		
		do {
			s.target = {
				row: Math.floor(Math.random() * s.gameboard),
				col: Math.floor(Math.random() * s.gameboard)
			};	
			console.log("Not found");
		} while (s.snakePts.find(findTarget) !== undefined);		
		$( `#row${s.target.row}-col${s.target.col}` )
			.addClass('target');
		return s.target;
	};

	var stop;
	s.runGame = () => {
		s.start = true;
		if ( angular.isDefined(stop) ) return;
		stop = $interval(function() {		

			let head = s.snakePts.slice(s.snakePts.length - 1, s.snakePts.length)[0];
			//if the box exists
			if ($( `#row${head.row}-col${head.col}` )
					.hasClass( 'snakebox' )) {

				MovementFactory.move(initialDirection, head).then(
					(newCoordinates) => {

						console.log("You are here, here are your coords: ", newCoordinates);
						//if the box is already a part of the snake, stop the fight
						if ($( `#row${newCoordinates.row}-col${newCoordinates.col}` )
								.hasClass( 'snake' )) {							
							s.stopFight();
						
						//or if the next box is the target, remove class of target, generate a new target, add the class of snake
						//then add it to our snakePts arr
						} else if ($( `#row${newCoordinates.row}-col${newCoordinates.col}` )
								.hasClass( 'target' )) {
							$( `#row${newCoordinates.row}-col${newCoordinates.col}` )
								.removeClass( 'target' ).addClass( 'snake' );
							s.snakePts.push(newCoordinates);
							s.generateTarget();
							if (s.snakePts.length % 10 === 0) s.pointsToAdd += 10;							
							s.gamePoints += s.pointsToAdd;							

						//Otherwise.. Keep going
						} else {								
							$( `#row${newCoordinates.row}-col${newCoordinates.col}` )
								.addClass( "snake" );
							let tail = s.snakePts.shift();
							$( `#row${tail.row}-col${tail.col}` )
								.removeClass( "snake" );
							s.snakePts.push(newCoordinates);
							console.log(s.snakePts);								
						}
				}); 								
			} else {				
				s.stopFight();
			}
		}, 200);
	};

	s.resetScope = () => {
		$interval.cancel(stop);		
		stop = undefined;		
	};

	s.stopFight = () => {
		if (angular.isDefined(stop)) {
			s.resetScope();					
			// $timeout(() => { 
			s.game = false; 
			s.start = undefined;
			console.log("Game status: ", s.game);
			let scores = {
				snake_length: s.snakePts.length,
				game_points: s.gamePoints
			};
			StorageFactory.setLocalScores(scores).then(
					(allScores) => {
						s.leaderboard = allScores;
						$timeout(() => {});
						console.log(s.leaderboard);
					}
				);
			// });
		}
	};

	s.$on('$destroy', function() {
		s.stopFight();
		s.start = undefined;
	});

	//determines movements
	$(document).keydown((event) => {
		console.log(event);
		if (s.start === true) {
			switch (event.which) {
				//move up
				case 38: 
					initialDirection = 'up';
					s.resetScope();
					s.runGame();
					break;
				//move left
				case 37: 
					initialDirection = 'left';
					s.resetScope();
					s.runGame();
					break;
				//move right
				case 39:
					initialDirection = 'right';
					s.resetScope();
					s.runGame();
					break;
				//move down
				case 40: 
					initialDirection = 'down';
					s.resetScope();
					s.runGame();
					break;
			}			
		}
	});	
});
