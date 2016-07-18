// To be run inside a web worker.

const GameState = require("../lib/state").GameState;
const minimax = require("../lib/minimax").computeMove;

onmessage = function(e) {
	var gameState = GameState.fromHashCode(e.data);
	var computerMove = minimax(gameState);
	postMessage(computerMove);
}
