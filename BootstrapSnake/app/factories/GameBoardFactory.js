"use strict";

app.factory("GameboardFactory", function() {

	let setupGameboard = (rowCount) => {
		return new Promise((resolve, reject) => {

			$( "<div class='snakeContainer col-xs-8 col-xs-offset-2 text-center'></div" ).appendTo( ".well" );
			for (var row = 0; row < rowCount; row++) {
				$("<div class='row snakerow'></div>").appendTo( ".snakeContainer" );
				for (var checkbox = 0; checkbox < rowCount; checkbox++) {
					$( `<div id="row${row}-col${checkbox}" class='snakebox'></div>  ` ).appendTo(" .snakerow:last-child ");
				}
			}
			if (row === rowCount) {
				resolve();
			}
		});
	};
	

	return {
		setupGameboard
	};
	
});
