"use strict";

app.factory("GameboardFactory", function() {

	let setupGameboard = (rowCount) => {
		return new Promise((resolve, reject) => {

			console.log($('.gameboard'));

			$( "<div class='snakeContainer col-xs-12 text-center'></div>" ).appendTo( ".gameboard" );
			for (var row = 0; row < rowCount; row++) {
				$("<div class='row snakerow'></div>").appendTo( ".snakeContainer" );
				for (var checkbox = 0; checkbox < rowCount; checkbox++) {
					$( `<div id="row${row}-col${checkbox}" class='col-xs-1 snakebox'></div>` ).appendTo(" .snakerow:last-child ");
				}
			}
			if (row === rowCount) resolve();			
		});
	};
	

	return {
		setupGameboard
	};
	
});
