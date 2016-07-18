"use strict";

const Snap = require("snapsvg");

const COLUMN_WIDTH = 18;
const PLAYER_HEIGHT = 16;
const CELL_HEIGHT = 12;
const PIPE_WIDTH = 2;
const RUNG_HEIGHT = 2;
const SCORE_BOX_HEIGHT = 10;
const COLORS = ["#FF0000", "#0000FF", "#D91BF2", "#129631", "#FFD000"];  // Need to add colors for more width

// Helper functions
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
	Paper.prototype.move = function(x, y) {
		return this.transform(new Snap.Matrix().translate(x, y));
	}
});

class OneCircleView {
	constructor(svg, isTop) {
		this.pipe = svg.rect(COLUMN_WIDTH/2-PIPE_WIDTH/2, (isTop ? PLAYER_HEIGHT/2 : 0), PIPE_WIDTH, PLAYER_HEIGHT/2);
		this.pipe.attr({
			fill: "#000000"
		});

		this.circle = svg.circle(COLUMN_WIDTH/2, PLAYER_HEIGHT/2, 6);
		this.circle.attr({
			fill: "#FFFFFF",
			stroke: "#000000",
			strokeWidth: 1
		});

		this.text = svg.text(COLUMN_WIDTH/2, PLAYER_HEIGHT/2, "\u00B7");
		this.text.attr({
			textAnchor: "middle",
			dominantBaseline: "central",
			fontFamily: "Arial",
			fontSize: 10
		});
	}

	setColor(color) {
		this.pipe.attr({
			fill: color
		});
		this.circle.attr({
			stroke: color
		});
		this.text.attr({
			fill: color
		});
	}

	setText(text) {
		this.text.attr({
			text: text
		});
	}
}

class CirclesView {
	// The size argument is the number of dimensions of the rung grid.
	constructor(size, svg, isTop) {
		this._size = size + 1;

		this.circles = [];
		for (let i=0; i<this._size; i++) {
			const circleGroup = svg.group().move(COLUMN_WIDTH * i, 0);
			circleGroup.attr({
				cursor: "pointer"
			});
			circleGroup.click(((...args) => {
				return (event) => {
					for (let callback of this.circleClickCallbacks) {
						// Ensure the callback is executed after the callbacks array is emptied.
						setTimeout(callback, 0, ...args);
					}
					this.circleClickCallbacks = [];
				};
			})(i));
			this.circles.push(new OneCircleView(circleGroup, isTop));
		}

		this.circleClickCallbacks = [];
	}

	setColorFor(pos, color) {
		this.circles[pos].setColor(color);
	}

	setTextFor(pos, text) {
		this.circles[pos].setText(text);
	}

	onceCircleClicked(next) {
		this.circleClickCallbacks.push(next);
	}
}

class CellView {
	constructor(svg) {
		this.pipe1 = svg.rect(COLUMN_WIDTH/2-PIPE_WIDTH/2, 0, PIPE_WIDTH, CELL_HEIGHT/2);
		this.pipe1.attr({
			fill: "#000000"
		});

		this.pipe2 = svg.rect(COLUMN_WIDTH/2-PIPE_WIDTH/2, CELL_HEIGHT/2, PIPE_WIDTH, CELL_HEIGHT/2);
		this.pipe2.attr({
			fill: "#000000"
		});
	}

	setTopColor(color) {
		this.pipe1.attr({
			fill: color
		});
	}

	setBottomColor(color) {
		this.pipe2.attr({
			fill: color
		});
	}
}

class RungView {
	constructor(svg) {
		this.rect1 = svg.rect(PIPE_WIDTH/2, CELL_HEIGHT/2-RUNG_HEIGHT, COLUMN_WIDTH/2-PIPE_WIDTH/2, RUNG_HEIGHT);
		this.rect1.attr({
			fill: "#D9D9D9"
		});

		this.rect2 = svg.rect(PIPE_WIDTH/2, CELL_HEIGHT/2, COLUMN_WIDTH/2-PIPE_WIDTH/2, RUNG_HEIGHT);
		this.rect2.attr({
			fill: "#D9D9D9"
		});

		this.rect3 = svg.rect(COLUMN_WIDTH/2, CELL_HEIGHT/2-RUNG_HEIGHT, COLUMN_WIDTH/2-PIPE_WIDTH/2, RUNG_HEIGHT);
		this.rect3.attr({
			fill: "#D9D9D9"
		});

		this.rect4 = svg.rect(COLUMN_WIDTH/2, CELL_HEIGHT/2, COLUMN_WIDTH/2-PIPE_WIDTH/2, RUNG_HEIGHT);
		this.rect4.attr({
			fill: "#D9D9D9"
		});

		this.circle = svg.circle(COLUMN_WIDTH/2, CELL_HEIGHT/2, 4);
		this.circle.attr({
			fill: "#FFFFFF",
			stroke: "#D9D9D9",
			strokeWidth: 1
		});

		this.text = svg.text(COLUMN_WIDTH/2, CELL_HEIGHT/2, "\u00B7");
		this.text.attr({
			textAnchor: "middle",
			dominantBaseline: "central",
			fontFamily: "Arial",
			fontSize: 10,
			fill: "#D9D9D9"
		});
	}

	setColors(color1, color2) {
		this.rect1.attr({
			fill: color1
		});
		this.rect2.attr({
			fill: color2
		});
		this.rect3.attr({
			fill: color2
		});
		this.rect4.attr({
			fill: color1
		});
		this.circle.attr({
			stroke: "#000000"
		});
		this.text.attr({
			fill: "#000000"
		});
	}

	setText(text) {
		this.text.attr({
			text: text
		});
	}
}

class GameView {
	constructor(size, id) {
		this.size = size;

		this.svg = Snap(id);
		const width = COLUMN_WIDTH * (size + 1);
		const height = 2 * PLAYER_HEIGHT + size * CELL_HEIGHT + SCORE_BOX_HEIGHT;
		this.svg.attr({
			viewBox: [0,0,width,height].join(" ")
		});

		this.p1 = new CirclesView(size, this.svg.group().move(0, 0), true);
		this.p2 = new CirclesView(size, this.svg.group().move(0, size * CELL_HEIGHT + PLAYER_HEIGHT), false);

		this.cells = [];
		for (let i=0; i<size; i++) {
			let row = [];
			for (let j=0; j<size+1; j++) {
				row.push(new CellView(this.svg.group().move(COLUMN_WIDTH * j, PLAYER_HEIGHT + CELL_HEIGHT * i)));
			}
			this.cells.push(row);
		}

		this.rungs = [];
		for (let i=0; i<size; i++) {
			const row = [];
			for (let j=0; j<size; j++) {
				const rungGroup = this.svg.group().move(COLUMN_WIDTH * j + COLUMN_WIDTH/2	, PLAYER_HEIGHT + CELL_HEIGHT * i);
				rungGroup.attr({
					cursor: "pointer"
				});
				rungGroup.click(((...args) => {
					return (event) => {
						for (let callback of this.rungClickCallbacks) {
							// Ensure the callback is executed after the callbacks array is emptied.
							setTimeout(callback, 0, ...args);
						}
						this.rungClickCallbacks = [];
					};
				})([i, j]));
				row.push(new RungView(rungGroup));
			}
			this.rungs.push(row);
		}
		this.rungClickCallbacks = [];

		this.scoreText = this.svg.text(width/2, height - SCORE_BOX_HEIGHT/2, "·");
		this.scoreText.attr({
			textAnchor: "middle",
			dominantBaseline: "central",
			fontFamily: "Arial",
			fontSize: 7,
			fill: "#000000"
		});
	}

	setScore(score) {
		this.scoreText.attr({
			text: "Current Score: " + score
		});
	}

	renderGameState(gameState) {
		const size = this.size;
		const matrix = gameState.rungs.getMatrix();
		let colors = COLORS.slice(0, size+1);
		for (let i=0; i<size; i++) {
			// Set top colors
			for (let j=0; j<=size; j++) {
				if (i === 0) {
					this.p1.setColorFor(j, colors[j]);
				}
				this.cells[i][j].setTopColor(colors[j]);
			}

			// Compute transitions and set rungs
			for (let j=0; j<size; j++) {
				let rungText = "";
				switch(matrix[i][j]) {
					case "·":
					case "—":
						rungText = "·";
						rungText = "·";
						break;
					case "+":
					case "*":
						rungText = "+";
						break;
				}
				this.rungs[i][j].setText(rungText);

				if (matrix[i][j] === "+" || matrix[i][j] === "—") {
					// Set rung
					this.rungs[i][j].setColors(colors[j], colors[j+1]);

					// Update colors array
					let temp = colors[j];
					colors[j] = colors[j+1];
					colors[j+1] = temp;
				}
			}

			// Set bottom colors
			for (let j=0; j<=size; j++) {
				if (i === size-1) {
					this.p2.setColorFor(j, colors[j]);
				}
				this.cells[i][j].setBottomColor(colors[j]);
			}
		}

		const p1positions = gameState.p1.getPositions();
		const p2positions = gameState.p2.getPositions();
		for (let j=0; j<=size; j++) {
			this.p1.setTextFor(j, p1positions[j]);
			this.p2.setTextFor(j, p2positions[j]);
		}

		this.setScore(gameState.getScore());
	}

	onceRungClicked(next) {
		this.rungClickCallbacks.push(next);
	}
}

module.exports = { GameView };
