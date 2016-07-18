"use strict";

const MAX_HUMAN_BREADTH = 10;
const MAX_COMPUTER_BREADTH = 10;

const MAX_DEPTH = 3;

function recurse(gameState, level, cache) {
	const size = gameState.size;
	const count = gameState.rungs.getCount();
	const key = gameState.hashCode();

	// Base Case 1
	if (gameState.rungs.getCount() >= size*2) {
		return {
			score: gameState.getScore(false),
			move: null
		};
	}

	// Base Case 2
	if (level > MAX_DEPTH) {
		return {
			score: gameState.getScore(false),
			move: null
		};
	}

	// Recursive Step
	if (!cache[key]) {
		if (count % 2 == 0) {
			// Human Player
			cache[key] = recurseHelper(gameState, gameState.p1, 1, MAX_HUMAN_BREADTH, level, cache);
		} else {
			// Computer Player
			cache[key] = recurseHelper(gameState, gameState.p2, -1, MAX_COMPUTER_BREADTH, level, cache);
		}
	}
	return cache[key];
}

function recurseHelper(gameState, player, direction, breadth, level, cache) {
	const bestCandidate = { score: -999, move: null };
	const playerMoves = player.getLegalMoves();
	if (playerMoves.length === 0) {
		console.error("WARNING: No legal player moves on game state " + gameState.hashCode());
		console.error(gameState.toString());
	}

	shuffle(playerMoves);
	playerMoves.splice(breadth);
	for (let playerMove of playerMoves) {
		player.setPosition(...playerMove);
		const rungsMoves = gameState.rungs.getLegalMoves();
		if (rungsMoves.length === 0) {
			console.error("WARNING: No legal rung moves on game state " + gameState.hashCode());
			console.error(gameState.toString());
		}

		shuffle(rungsMoves);
		rungsMoves.splice(breadth);
		for (let rungMove of rungsMoves) {
			gameState.rungs.setPosition(...rungMove);

			const candidate = recurse(gameState, level + 1, cache);
			// console.log(candidate);
			// console.log(gameState.toString());

			if (candidate.score * direction > bestCandidate.score) {
				bestCandidate.score = candidate.score * direction;
				bestCandidate.move = [rungMove, playerMove];
			}
			gameState.rungs.clearPosition(...rungMove);
		}
		player.clearPosition(...playerMove);
	}
	bestCandidate.score *= direction;
	return bestCandidate;
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}

function computeMove(gameState, next) {
	let candidate = recurse(gameState, 1, {});
	return { rungs: candidate.move[0], p2: candidate.move[1] };
}

module.exports = { computeMove };
