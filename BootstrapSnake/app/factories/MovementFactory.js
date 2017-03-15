"use strict";

app.factory("MovementFactory", function() {

	let move = (direction, coordinates) => {
		return new Promise ((resolve, reject) => {
			
			let newCoordinates = {};
			switch (direction) {
				case 'left': 
					newCoordinates.row = coordinates.row;
					newCoordinates.col = coordinates.col - 1;
					resolve(newCoordinates);
					break;
				case 'right':
					newCoordinates.row = coordinates.row;
					newCoordinates.col = coordinates.col + 1;
					resolve(newCoordinates);
					break;
				case 'up':
					newCoordinates.row = coordinates.row - 1;
					newCoordinates.col = coordinates.col;
					resolve(newCoordinates);
					break;
				case 'down':
					newCoordinates.row = coordinates.row + 1;
					newCoordinates.col = coordinates.col;
					resolve(newCoordinates);
					break;
			}		

		});
	};
	

	return {
		move
	};
	
});
