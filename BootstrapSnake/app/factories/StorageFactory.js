"use strict";

app.factory("StorageFactory", function() {


	let addToLocalStorage = (objToAddTo, userScore) => {
		objToAddTo[Date.now()] = userScore;						
		window.localStorage.setItem('snakeScores', JSON.stringify(objToAddTo));
		return;
	};

	let getLocalScores = () => {
		return new Promise((resolve, reject) => {
			let myScores = JSON.parse(window.localStorage.getItem('snakeScores'));
			console.log('myScores', myScores);
			resolve(myScores);
		});
	};

	let tranformScores = (scoresObj) => {
		let arrVersion = Object.keys(scoresObj).map((timeStamp) => {
			return [timeStamp, scoresObj[timeStamp].game_points, scoresObj[timeStamp].snake_length];
		}).sort((a, b) => a[1] - b[1])
		.reverse();
		return arrVersion;
	};


	let setLocalScores = (scores) => {
		return new Promise((resolve, reject) => {			
			getLocalScores().then(
				(snakeScores) => {
					console.log(snakeScores);					
					if (snakeScores === null) {
						let newScores = {};
						addToLocalStorage(newScores, scores);
						getLocalScores().then(
							(updatedScores) => resolve(tranformScores(updatedScores)) );						
					} else if (Object.keys(snakeScores).length < 5) {
						console.log(snakeScores);
						addToLocalStorage(snakeScores, scores);
						getLocalScores().then(
							(updatedScores) => resolve(tranformScores(updatedScores)) );						
					} else {						
						//Include your new score set
						let currentTimeStamp = Date.now();
						snakeScores[currentTimeStamp] = scores;
						//This takes your snakePoints Obj and turns it into an array that is 'sort'able. 
						//sort that array by points so you can check if your current score is the lowest score. 
						let sortableArray = Object.keys(snakeScores).map((timeStamp) => {
							return [timeStamp, snakeScores[timeStamp].game_points, snakeScores[timeStamp].snake_length];
						}).sort( (a, b) => a[1] - b[1] )
						.reverse();
						let sortedArrLen = sortableArray.length;						
						//if your current score is the same as lowest score, remove your score from snakeScores and resolve
						if (scores.game_points === sortableArray[sortedArrLen - 1][1]) {
							delete snakeScores[currentTimeStamp];
							resolve(tranformScores(snakeScores));
						//If current score is not the lowest score.. remove the lowest score from snakePoints and 
						//reset it to localstorage then resolve
						} else {
							let lowestScore = sortableArray.pop();
							delete snakeScores[lowestScore[0]];
							window.localStorage.setItem('snakeScores', JSON.stringify(snakeScores));							
							resolve(tranformScores(snakeScores));
						}												
						
					}	
				});
		});
	};



	return {
		getLocalScores,
		setLocalScores
	};
	
});
