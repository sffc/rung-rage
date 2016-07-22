// To be run inside a web worker.

const GameState = require("../lib/state").GameState;
const MinimaxPlayer = require("../lib/minimax").MinimaxPlayer;

const minimax = new MinimaxPlayer();

onmessage = function(e) {
	var gameState = GameState.fromHashCode(e.data);
	var computerMove = minimax.computeMove(gameState);
	postMessage(computerMove);
}
