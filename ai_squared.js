// Play the computer against itself.

const async = require("async");
const GameState = require("./lib/state").GameState;
const minimaxComputeMove = require("./lib/minimax").computeMove;

function playGame(next) {
	var gameState = GameState.getDefault(4);
	var playRound = function(isPlayer1) {
		return function(_next) {
			var move = minimaxComputeMove(gameState, isPlayer1 ? 0 : 1);
			gameState.rungs.setPosition(...move.rungs);
			if (isPlayer1) {
				gameState.p1.setPosition(...move.p2);
			} else {
				gameState.p2.setPosition(...move.p2);
			}
			_next(null);
		};
	};
	async.series([
		playRound(true),
		playRound(false),
		playRound(true),
		playRound(false),
		playRound(true),
		playRound(false),
		playRound(true),
		playRound(false)
	], (err) => {
		next(err, gameState);
	});
}

async.forever(
	(next) => {
		playGame((err, gameState) => {
			console.log(gameState.getScore());
			next(null);
		});
	},
	(err) => {
		console.error(err);
	}
);
