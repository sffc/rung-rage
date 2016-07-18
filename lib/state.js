"use strict";

class CirclesState {
	// The size argument is the number of dimensions of the rung grid.
	constructor(mask, size) {
		this._mask = mask;
		this._size = size + 1;
		this.MAX_CIRCLE_NUMBER = size;

		this.SPOT_BITS = 1;
		this.BITS_PER_SPOT = 1;
		while (this.SPOT_BITS < this.MAX_CIRCLE_NUMBER) {
			this.SPOT_BITS <<= 1;
			this.SPOT_BITS += 1;
			this.BITS_PER_SPOT += 1;
		}
	}

	getPositions() {
		var positions = [];
		for (let i=0; i<this._size; i++) {
			var spot = (this._mask >> (this.BITS_PER_SPOT * i)) & this.SPOT_BITS;
			positions.push(spot);
		}
		return positions;
	}

	clearPosition(pos) {
		this._mask ^= this._mask & (this.SPOT_BITS << (this.BITS_PER_SPOT * pos));
	}

	setPosition(pos, value) {
		this.clearPosition(pos);
		this._mask |= value << (this.BITS_PER_SPOT * pos);
	}

	isLegal(pos, value) {
		var currentPositions = this.getPositions();
		return 0 <= pos && pos < this._size &&
			0 < value && value <= this.MAX_CIRCLE_NUMBER &&
			currentPositions[pos] === 0 &&
			currentPositions.indexOf(value) === -1;
	}

	getLegalMoves() {
		var currentPositions = this.getPositions();
		var result = [];
		for (let i=0; i<this._size; i++) {
			if (currentPositions[i] !== 0) continue;
			for (let j=1; j<=this.MAX_CIRCLE_NUMBER; j++) {
				if (currentPositions.indexOf(j) !== -1) continue;
				result.push([i, j]);
			}
		}
		return result;
	}
}

class RungsState {
	// Assumes that stars is the same size as rungs
	constructor(mask, starsMask, size) {
		this._mask = mask;
		this._starsMask = starsMask;
		this._size = size;
	}

	getCount() {
		let count = 0;
		for (let i=0; i<this._size; i++) {
			var row = [];
			for (let j=0; j<this._size; j++) {
				if (this._bitOn(i, j)) {
					count++;
				}
			}
		}
		return count;
	}

	getMatrix() {
		var matrix = [];
		for (let i=0; i<this._size; i++) {
			var row = [];
			for (let j=0; j<this._size; j++) {
				let present = this._bitOn(i, j);
				let star = this._starOn(i, j);
				row.push(star ? (present ? "+" : "*") : (present ? "—" : "·"));
			}
			matrix.push(row);
		}
		return matrix;
	}

	clearPosition(i, j) {
		this._mask ^= (this._mask & this._bitForPosition(i, j));
	}

	setPosition(i, j) {
		this._mask |= this._bitForPosition(i, j);
	}

	isLegal(i, j) {
		return 0 <= i && i < this._size &&
			0 <= j && j < this._size &&
			!this._bitOn(i, j) &&
			(j == 0 || !this._bitOn(i, j-1)) &&
			(j == this._size-1 || !this._bitOn(i, j+1));
	}

	getLegalMoves() {
		var result = [];
		for (let i=0; i<this._size; i++) {
			for (let j=0; j<this._size; j++) {
				if (this.isLegal(i, j)) {
					result.push([i, j]);
				}
			}
		}
		return result;
	}

	walkFrom(i1) {
		let j = i1;
		let stars = 0;
		for (let i=0; i<this._size; i++) {
			if (j < this._size && this._bitOn(i, j)) {
				if (this._starOn(i, j)) stars++;
				j += 1;
			} else if (j > 0 && this._bitOn(i, j-1)) {
				if (this._starOn(i, j-1)) stars++;
				j -= 1;
			}
		}
		return { i2: j, stars };
	}

	_bitForPosition(i, j) {
		const index = (i*this._size + j);
		return 1 << index;
	}

	_bitOn(i, j) {
		return (this._mask & this._bitForPosition(i, j)) > 0;
	}

	_starOn(i, j) {
		return (this._starsMask & this._bitForPosition(i, j)) > 0;
	}
}

class GameState {
	constructor(rungs, p1, p2, size) {
		// Assumes that rungs, p1, and p2 are all initialized with the same size
		this.rungs = rungs;
		this.p1 = p1;
		this.p2 = p2;
		this.size = size;
	}

	getScore(verbose) {
		let score = 0;
		let positions1 = this.p1.getPositions();
		let positions2 = this.p2.getPositions();
		for (let i1=0; i1<=this.size; i1++) {
			let r = this.rungs.walkFrom(i1);
			let i2 = r.i2;  // let { i2, stars } = ...  doesn't seem to work yet
			let stars = r.stars;
			let s1 = positions1[i1];
			let s2 = positions2[i2];
			if (s1 > s2) {
				score += 1 + stars;
			} else if (s1 < s2) {
				score -= 1 + stars;
			}
			if (verbose) {
				console.log("path:", i1, i2, s1, s2, stars);
			}
		}
		return score;
	}

	hashCode() {
		return this.size + ":" + this.rungs._mask + ":" + this.rungs._starsMask + ":" + this.p1._mask + ":" + this.p2._mask;
	}

	// Works best for size < 10
	toString() {
		let result = "\n";
		for (const value of this.p1.getPositions()) {
			result += value + " ";
		}
		result += "\n";
		let matrix = this.rungs.getMatrix();
		for (let i=0; i<matrix.length; i++) {
			let row = matrix[i];
			result += "|";
			for (let j=0; j<row.length; j++) {
				result += row[j] + "|";
			}
			result += "\n";
		}
		for (const value of this.p2.getPositions()) {
			result += value + " ";
		}
		return result;
	}

	static getDefault(size) {
		var starsMask = 0;
		for (let i=0; i<size; i++) {
			for (let j=0; j<size; j++) {
				if (Math.random() < 0.3) {
					starsMask |= (1 << (i*size + j));
				}
			}
		}

		var rungs = new RungsState(0, starsMask, size);
		var p1 = new CirclesState(0, size);
		var p2 = new CirclesState(0, size);
		return new GameState(rungs, p1, p2, size);
	}

	static fromHashCode(hashCode) {
		var masks = hashCode.split(":").map((i) => { return parseInt(i) });
		var size = masks[0];
		var rungs = new RungsState(masks[1], masks[2], size);
		var p1 = new CirclesState(masks[3], size);
		var p2 = new CirclesState(masks[4], size);
		var gameState = new GameState(rungs, p1, p2, size);
		if (gameState.hashCode() !== hashCode) {
			throw new Error("Could not create game state from hash code!");
		}
		return gameState;
	}
}

module.exports = { GameState };
