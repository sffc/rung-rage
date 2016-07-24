// Play the computer against itself.

const async = require("async");
const GameState = require("./lib/state").GameState;
const MinimaxPlayer = require("./lib/minimax").MinimaxPlayer;

async.forever(
	(next) => {
		var player1 = new MinimaxPlayer();
		var player2 = new MinimaxPlayer();

		// Make a custom start state:
		var gameState = GameState.makeFromStarMatrix([
			[true, false, false, true],
			[false, true, true, false],
			[false, true, true, false],
			[true, false, false, false]
		]);

		// To make a random start state instead, you can do this:
		// var gameState = GameState.createRandom(4);

		// Make player1 have a search depth of 2 instead of the default 3:
		player1.maxDepth = 2;

		// Make player2 have a search breadth of 5 instead of the default 10:
		player2.maxBreadth = 5;

		// Make player2's moves work in favor of the other player:
		// player2.playsReverse = true;

		async.waterfall([
			(_next) => {
				playGame(gameState, player1, player2, _next);
			},
			(moves, _next) => {
				// console.log(moves);
				console.log(gameState.getScore());
				_next(null);
			}
		], next);
	},
	(err) => {
		console.error("Error:", err);
	}
);




// No need to mess with this part of the code.
function playGame(gameState, player1, player2, next) {
	var playRound = function(player) {
		return function(_next) {
			var isTopPlayersTurn = gameState.isTopPlayersTurn();
			var gamePlayer = (isTopPlayersTurn ? gameState.p1 : gameState.p2);
			var move = player.computeMove(gameState);
			gameState.rungs.setPosition(...move.rungs);
			gamePlayer.setPosition(...move.player);
			_next(null, move);
		};
	};
	async.series([
		playRound(player1),
		playRound(player2),
		playRound(player1),
		playRound(player2),
		playRound(player1),
		playRound(player2),
		playRound(player1),
		playRound(player2)
	], next);
}
