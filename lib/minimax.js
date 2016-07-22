"use strict";

const DEFAULT_MAX_DEPTH = 3;
const DEFAULT_MAX_BREADTH = 10;

function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}

// Use "maxDepth" to control the number of moves that this player looks ahead.
// Use "maxBreadth" to control the number of possibilities at each turn to consider.
// Use "playsReverse" to make this player seek to minimize its score rather than maximize it.
class MinimaxPlayer {
	constructor() {
		this.maxDepth = DEFAULT_MAX_DEPTH;
		this.maxBreadth = DEFAULT_MAX_BREADTH;
		this.playsReverse = false;
	}

	computeMove(gameState) {
		const candidate = this._recurse(gameState, 0, {});
		return { rungs: candidate.move[0], player: candidate.move[1] };
	}

	_recurse(gameState, level, cache) {
		const size = gameState.size;
		const key = gameState.hashCode();
		const isTopPlayersTurn = gameState.isTopPlayersTurn();

		// Base Case 1
		if (gameState.rungs.getCount() >= size*2) {
			return {
				score: gameState.getScore(false),
				move: null
			};
		}

		// Base Case 2
		if (level >= this.maxDepth) {
			return {
				score: gameState.getScore(false),
				move: null
			};
		}

		// Recursive Step
		if (!cache[key]) {
			var player = (isTopPlayersTurn ? gameState.p1 : gameState.p2);
			var bestCandidate = { score: (isTopPlayersTurn ? -999 : 999), move: null };

			var playerMoves = player.getLegalMoves();
			if (playerMoves.length === 0) {
				console.error("WARNING: No legal player moves on game state " + gameState.hashCode());
				console.error(gameState.toString());
			}
			shuffle(playerMoves);
			playerMoves.splice(this.maxBreadth);
			for (let playerMove of playerMoves) {
				player.setPosition(...playerMove);

				var rungsMoves = gameState.rungs.getLegalMoves();
				if (rungsMoves.length === 0) {
					console.error("WARNING: No legal rung moves on game state " + gameState.hashCode());
					console.error(gameState.toString());
				}
				shuffle(rungsMoves);
				rungsMoves.splice(this.maxBreadth);
				for (let rungMove of rungsMoves) {
					gameState.rungs.setPosition(...rungMove);

					var candidate = this._recurse(gameState, level + 1, cache);
					if (
							(( isTopPlayersTurn || this.playsReverse) && candidate.score > bestCandidate.score) ||
							((!isTopPlayersTurn || this.playsReverse) && candidate.score < bestCandidate.score)) {
						bestCandidate.score = candidate.score;
						bestCandidate.move = [rungMove, playerMove];
					}

					gameState.rungs.clearPosition(...rungMove);
				}
				player.clearPosition(...playerMove);
			}
			return bestCandidate;
		}
		return cache[key];
	}
}

module.exports = { MinimaxPlayer };
