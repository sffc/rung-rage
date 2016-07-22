"use strict";

const readline = require("readline");
const async = require("async");
const GameState = require("./lib/state").GameState;
const MinimaxPlayer = require("./lib/minimax").MinimaxPlayer;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const minimax = new MinimaxPlayer();

function promptForMove(next) {
	console.log("Format: i j pos value");
	rl.question("Enter your move: ", (answer) => {
		let fields = answer.trim().split(/\s/).map((v) => { return parseInt(v); });
		if (fields.length != 4) {
			console.log("Invalid format; please try again.");
			return promptForMove(next);
		}
		next(null, ...fields);
	});
}

var gameState = GameState.createRandom(4);
console.log(gameState.toString());

async.forever(
	(next) => {
		async.waterfall([
			(_next) => {
				promptForMove(_next);
			},
			(i, j, pos, value, _next) => {
				if (!gameState.rungs.isLegal(i, j)) {
					console.log("Illegal rung placement!");
					return _next(null);
				}
				if (!gameState.p1.isLegal(pos, value)) {
					console.log("Illegal circle placement!");
					return _next(null);
				}

				// Commit the move.
				gameState.rungs.setPosition(i, j);
				gameState.p1.setPosition(pos, value);
				console.log(gameState.toString());
				console.log("Current Score: " + gameState.getScore(true));

				// Compute computer move.
				var hc1 = gameState.hashCode();
				let computerMove = minimax.computeMove(gameState);
				var hc2 = gameState.hashCode();
				if (hc1 !== hc2) {
					console.error("WARNING: Game state not reset after call to minimaxComputeMove");
				}
				gameState.rungs.setPosition(...computerMove.rungs);
				gameState.p2.setPosition(...computerMove.player);
				console.log(gameState.toString());
				console.log("Current Score: " + gameState.getScore(true));

				// Is the game over?
				if (gameState.rungs.getCount() === 2 * gameState.size) {
					const finalScore = gameState.getScore();
					if (finalScore > 0) {
						console.log("You win.  Beginner's luck.");
					} else if (finalScore < 0) {
						console.log("You LOSE!  Mwahahaha");
					} else {
						console.log("Tie.  Great minds think alike.");
					}
					return _next(true);
				}

				return _next(null);
			}
		], next);
	},
	(err) => {
		console.log(err);
		rl.close();
	}
);
