"use strict";

const async = require("async");
const GameState = require("../lib/state").GameState;
const GameView = require("../lib/ui").GameView;
const Howl = require("howler").Howl;

// Variables that are safe to be static.
var computerWorker = new Worker("bundle_minimax.js");
var soundStone = new Howl({
	urls: ["assets/stone.ogg", "assets/stone.aiff"]
});
var soundBeeps = new Howl({
	urls: ["assets/beeps.ogg", "assets/beeps.wav"]
});
var soundWhistle = new Howl({
	urls: ["assets/whistle.ogg", "assets/whistle.wav"]
});
var soundFogHorn = new Howl({
	urls: ["assets/foghorn.ogg", "assets/foghorn.wav"]
});
var soundWin = new Howl({
	urls: ["assets/win.ogg", "assets/win.wav"]
});

function playGame(size, svgElementId) {
	var view = new GameView(size, svgElementId);
	var gameState = GameState.getDefault(size);
	view.renderGameState(gameState);

	window.gameState = gameState;  // For debugging convenience

	async.forever(
		(next) => {
			async.auto({
				"rung": (_next) => {
					async.doUntil(
						(__next) => {
							view.onceRungClicked(async.apply(__next, null));
						},
						(results, __next) => {
							const isLegal = gameState.rungs.isLegal(...results);
							if (!isLegal) {
								// Use alert.call() to ensure that the evaluation isn't performed ahead of time by the optimizer.
								alert.call(null, "That rung cannot be selected any more!");
							} else {
								gameState.rungs.setPosition(...results);
								view.renderGameState(gameState);
								soundStone.play();
							}
							return isLegal;
						},
						async.ensureAsync(_next)
					);
				},
				"circle": (_next) => {
					async.doUntil(
						(__next) => {
							async.series([
								(___next) => {
									view.p1.onceCircleClicked(async.apply(___next, null));
								},
								(___next) => {
									// Use prompt.call() to ensure that the evaluation isn't performed ahead of time by the optimizer.
									let result = prompt.call(null, "Enter a number:", "");
									___next(null, parseInt(result));
								}
							], __next);
						},
						(results, __next) => {
							if (Number.isNaN(results[1])) return false;  // Cancel button or garbage text
							const isLegal = gameState.p1.isLegal(...results);
							if (!isLegal) {
								// Use alert.call() to ensure that the evaluation isn't performed ahead of time by the optimizer.
								alert.call(null, "You cannot put that value in that circle.");
							} else {
								gameState.p1.setPosition(...results);
								view.renderGameState(gameState);
								soundStone.play();
							}
							return isLegal;
						},
						async.ensureAsync(_next)
					);
				},
				"computer": ["rung", "circle", (results, _next) => {
					computerWorker.postMessage(gameState.hashCode());
					computerWorker.onmessage = (e) => {
						computerWorker.onmessage = null;
						_next(null, e.data);
					}
				}],
				"resolve": ["computer", (results, _next) => {
					const computerMove = results.computer;
					console.log("Computer Move:", computerMove);

					gameState.rungs.setPosition(...computerMove.rungs);
					gameState.p2.setPosition(...computerMove.p2);
					view.renderGameState(gameState);

					// Is the game over?
					if (gameState.rungs.getCount() === 2 * gameState.size) {
						const finalScore = gameState.getScore();
						if (finalScore > 0) {
							soundWin.play();
							alert("You win!");
						} else if (finalScore < 0) {
							soundWhistle.play();
							alert("You lose!");
						} else {
							soundFogHorn.play();
							alert("Tie.  Great minds think alike.");
						}
						return _next(true);
					} else {
						soundBeeps.play();
					}

					return _next(null);
				}]
			}, next);
		},
		(err) => {
			if (err !== true) {
				console.error("Error:", err);
			}
		}
	);
}

module.exports = { playGame };
