"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
        return arr2;
    }
    return Array.from(arr);
}

var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
            "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
        Constructor;
    };
}();

!function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s;
}({
    1: [ function(require, module, exports) {
        var playGame = require("../lib/controller").playGame;
        playGame(4, "#game");
    }, {
        "../lib/controller": 2
    } ],
    2: [ function(require, module, exports) {
        function playGame(size, svgElementId) {
            var view = new GameView(size, svgElementId), gameState = GameState.createRandom(size);
            view.renderGameState(gameState), window.gameState = gameState, async.forever(function(next) {
                async.auto({
                    rung: function(_next) {
                        async.doUntil(function(__next) {
                            view.onceRungClicked(async.apply(__next, null));
                        }, function(results, __next) {
                            var _gameState$rungs, isLegal = (_gameState$rungs = gameState.rungs).isLegal.apply(_gameState$rungs, _toConsumableArray(results));
                            if (isLegal) {
                                var _gameState$rungs2;
                                (_gameState$rungs2 = gameState.rungs).setPosition.apply(_gameState$rungs2, _toConsumableArray(results)), 
                                view.renderGameState(gameState), soundStone.play();
                            } else alert.call(null, "That rung cannot be selected any more!");
                            return isLegal;
                        }, async.ensureAsync(_next));
                    },
                    circle: function(_next) {
                        async.doUntil(function(__next) {
                            async.series([ function(___next) {
                                view.p1.onceCircleClicked(async.apply(___next, null));
                            }, function(___next) {
                                var result = prompt.call(null, "Enter a number:", "");
                                ___next(null, parseInt(result));
                            } ], __next);
                        }, function(results, __next) {
                            var _gameState$p;
                            if (Number.isNaN(results[1])) return !1;
                            var isLegal = (_gameState$p = gameState.p1).isLegal.apply(_gameState$p, _toConsumableArray(results));
                            if (isLegal) {
                                var _gameState$p2;
                                (_gameState$p2 = gameState.p1).setPosition.apply(_gameState$p2, _toConsumableArray(results)), 
                                view.renderGameState(gameState), soundStone.play();
                            } else alert.call(null, "You cannot put that value in that circle.");
                            return isLegal;
                        }, async.ensureAsync(_next));
                    },
                    computer: [ "rung", "circle", function(results, _next) {
                        computerWorker.postMessage(gameState.hashCode()), computerWorker.onmessage = function(e) {
                            computerWorker.onmessage = null, _next(null, e.data);
                        };
                    } ],
                    resolve: [ "computer", function(results, _next) {
                        var _gameState$rungs3, _gameState$p3, computerMove = results.computer;
                        if (console.log("Computer Move:", computerMove), (_gameState$rungs3 = gameState.rungs).setPosition.apply(_gameState$rungs3, _toConsumableArray(computerMove.rungs)), 
                        (_gameState$p3 = gameState.p2).setPosition.apply(_gameState$p3, _toConsumableArray(computerMove.player)), 
                        view.renderGameState(gameState), gameState.rungs.getCount() === 2 * gameState.size) {
                            var finalScore = gameState.getScore();
                            return finalScore > 0 ? (soundWin.play(), alert("You win!")) : finalScore < 0 ? (soundWhistle.play(), 
                            alert("You lose!")) : (soundFogHorn.play(), alert("Tie.  Great minds think alike.")), 
                            _next(!0);
                        }
                        return soundBeeps.play(), _next(null);
                    } ]
                }, next);
            }, function(err) {
                err !== !0 && console.error("Error:", err);
            });
        }
        var async = require("async"), GameState = require("../lib/state").GameState, GameView = require("../lib/ui").GameView, Howl = require("howler").Howl, computerWorker = new Worker("bundle_minimax.js"), soundStone = new Howl({
            urls: [ "assets/stone.ogg", "assets/stone.aiff" ]
        }), soundBeeps = new Howl({
            urls: [ "assets/beeps.ogg", "assets/beeps.wav" ]
        }), soundWhistle = new Howl({
            urls: [ "assets/whistle.ogg", "assets/whistle.wav" ]
        }), soundFogHorn = new Howl({
            urls: [ "assets/foghorn.ogg", "assets/foghorn.wav" ]
        }), soundWin = new Howl({
            urls: [ "assets/win.ogg", "assets/win.wav" ]
        });
        module.exports = {
            playGame: playGame
        };
    }, {
        "../lib/state": 3,
        "../lib/ui": 4,
        async: 5,
        howler: 7
    } ],
    3: [ function(require, module, exports) {
        var CirclesState = function() {
            function CirclesState(mask, size) {
                for (_classCallCheck(this, CirclesState), this._mask = mask, this._size = size + 1, 
                this.MAX_CIRCLE_NUMBER = size, this.SPOT_BITS = 1, this.BITS_PER_SPOT = 1; this.SPOT_BITS < this.MAX_CIRCLE_NUMBER; ) this.SPOT_BITS <<= 1, 
                this.SPOT_BITS += 1, this.BITS_PER_SPOT += 1;
            }
            return _createClass(CirclesState, [ {
                key: "getPositions",
                value: function() {
                    for (var positions = [], i = 0; i < this._size; i++) {
                        var spot = this._mask >> this.BITS_PER_SPOT * i & this.SPOT_BITS;
                        positions.push(spot);
                    }
                    return positions;
                }
            }, {
                key: "clearPosition",
                value: function(pos) {
                    this._mask ^= this._mask & this.SPOT_BITS << this.BITS_PER_SPOT * pos;
                }
            }, {
                key: "setPosition",
                value: function(pos, value) {
                    this.clearPosition(pos), this._mask |= value << this.BITS_PER_SPOT * pos;
                }
            }, {
                key: "isLegal",
                value: function(pos, value) {
                    var currentPositions = this.getPositions();
                    return 0 <= pos && pos < this._size && 0 < value && value <= this.MAX_CIRCLE_NUMBER && 0 === currentPositions[pos] && currentPositions.indexOf(value) === -1;
                }
            }, {
                key: "getLegalMoves",
                value: function() {
                    for (var currentPositions = this.getPositions(), result = [], i = 0; i < this._size; i++) if (0 === currentPositions[i]) for (var j = 1; j <= this.MAX_CIRCLE_NUMBER; j++) currentPositions.indexOf(j) === -1 && result.push([ i, j ]);
                    return result;
                }
            } ]), CirclesState;
        }(), RungsState = function() {
            function RungsState(mask, starsMask, size) {
                _classCallCheck(this, RungsState), this._mask = mask, this._starsMask = starsMask, 
                this._size = size;
            }
            return _createClass(RungsState, [ {
                key: "getCount",
                value: function() {
                    for (var count = 0, i = 0; i < this._size; i++) for (var j = 0; j < this._size; j++) this._bitOn(i, j) && count++;
                    return count;
                }
            }, {
                key: "getMatrix",
                value: function() {
                    for (var matrix = [], i = 0; i < this._size; i++) {
                        for (var row = [], j = 0; j < this._size; j++) {
                            var present = this._bitOn(i, j), star = this._starOn(i, j);
                            row.push(star ? present ? "+" : "*" : present ? "—" : "·");
                        }
                        matrix.push(row);
                    }
                    return matrix;
                }
            }, {
                key: "clearPosition",
                value: function(i, j) {
                    this._mask ^= this._mask & this._bitForPosition(i, j);
                }
            }, {
                key: "setPosition",
                value: function(i, j) {
                    this._mask |= this._bitForPosition(i, j);
                }
            }, {
                key: "isLegal",
                value: function(i, j) {
                    return !(!(0 <= i && i < this._size && 0 <= j && j < this._size) || this._bitOn(i, j) || 0 != j && this._bitOn(i, j - 1) || j != this._size - 1 && this._bitOn(i, j + 1));
                }
            }, {
                key: "getLegalMoves",
                value: function() {
                    for (var result = [], i = 0; i < this._size; i++) for (var j = 0; j < this._size; j++) this.isLegal(i, j) && result.push([ i, j ]);
                    return result;
                }
            }, {
                key: "walkFrom",
                value: function(i1) {
                    for (var j = i1, stars = 0, i = 0; i < this._size; i++) j < this._size && this._bitOn(i, j) ? (this._starOn(i, j) && stars++, 
                    j += 1) : j > 0 && this._bitOn(i, j - 1) && (this._starOn(i, j - 1) && stars++, 
                    j -= 1);
                    return {
                        i2: j,
                        stars: stars
                    };
                }
            }, {
                key: "_bitForPosition",
                value: function(i, j) {
                    var index = i * this._size + j;
                    return 1 << index;
                }
            }, {
                key: "_bitOn",
                value: function(i, j) {
                    return (this._mask & this._bitForPosition(i, j)) > 0;
                }
            }, {
                key: "_starOn",
                value: function(i, j) {
                    return (this._starsMask & this._bitForPosition(i, j)) > 0;
                }
            } ]), RungsState;
        }(), GameState = function() {
            function GameState(rungs, p1, p2, size) {
                _classCallCheck(this, GameState), this.rungs = rungs, this.p1 = p1, this.p2 = p2, 
                this.size = size;
            }
            return _createClass(GameState, [ {
                key: "getScore",
                value: function(verbose) {
                    for (var score = 0, positions1 = this.p1.getPositions(), positions2 = this.p2.getPositions(), i1 = 0; i1 <= this.size; i1++) {
                        var r = this.rungs.walkFrom(i1), i2 = r.i2, stars = r.stars, s1 = positions1[i1], s2 = positions2[i2];
                        s1 > s2 ? score += 1 + stars : s1 < s2 && (score -= 1 + stars), verbose && console.log("path:", i1, i2, s1, s2, stars);
                    }
                    return score;
                }
            }, {
                key: "isTopPlayersTurn",
                value: function() {
                    return this.rungs.getCount() % 2 === 0;
                }
            }, {
                key: "hashCode",
                value: function() {
                    return this.size + ":" + this.rungs._mask + ":" + this.rungs._starsMask + ":" + this.p1._mask + ":" + this.p2._mask;
                }
            }, {
                key: "toString",
                value: function() {
                    var result = "\n", _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
                    try {
                        for (var _step, _iterator = this.p1.getPositions()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0) {
                            var value = _step.value;
                            result += value + " ";
                        }
                    } catch (err) {
                        _didIteratorError = !0, _iteratorError = err;
                    } finally {
                        try {
                            !_iteratorNormalCompletion && _iterator["return"] && _iterator["return"]();
                        } finally {
                            if (_didIteratorError) throw _iteratorError;
                        }
                    }
                    result += "\n";
                    for (var matrix = this.rungs.getMatrix(), i = 0; i < matrix.length; i++) {
                        var row = matrix[i];
                        result += "|";
                        for (var j = 0; j < row.length; j++) result += row[j] + "|";
                        result += "\n";
                    }
                    var _iteratorNormalCompletion2 = !0, _didIteratorError2 = !1, _iteratorError2 = void 0;
                    try {
                        for (var _step2, _iterator2 = this.p2.getPositions()[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = !0) {
                            var _value = _step2.value;
                            result += _value + " ";
                        }
                    } catch (err) {
                        _didIteratorError2 = !0, _iteratorError2 = err;
                    } finally {
                        try {
                            !_iteratorNormalCompletion2 && _iterator2["return"] && _iterator2["return"]();
                        } finally {
                            if (_didIteratorError2) throw _iteratorError2;
                        }
                    }
                    return result;
                }
            } ], [ {
                key: "createRandom",
                value: function(size) {
                    for (var starsMask = 0, i = 0; i < size; i++) for (var j = 0; j < size; j++) Math.random() < .3 && (starsMask |= 1 << i * size + j);
                    var rungs = new RungsState(0, starsMask, size), p1 = new CirclesState(0, size), p2 = new CirclesState(0, size);
                    return new GameState(rungs, p1, p2, size);
                }
            }, {
                key: "makeFromStarMatrix",
                value: function(matrix) {
                    for (var size = matrix.length, starsMask = 0, i = 0; i < size; i++) for (var j = 0; j < size; j++) matrix[i][j] && (starsMask |= 1 << i * size + j);
                    var rungs = new RungsState(0, starsMask, size), p1 = new CirclesState(0, size), p2 = new CirclesState(0, size);
                    return new GameState(rungs, p1, p2, size);
                }
            }, {
                key: "fromHashCode",
                value: function(hashCode) {
                    var masks = hashCode.split(":").map(function(i) {
                        return parseInt(i);
                    }), size = masks[0], rungs = new RungsState(masks[1], masks[2], size), p1 = new CirclesState(masks[3], size), p2 = new CirclesState(masks[4], size), gameState = new GameState(rungs, p1, p2, size);
                    if (gameState.hashCode() !== hashCode) throw new Error("Could not create game state from hash code!");
                    return gameState;
                }
            } ]), GameState;
        }();
        module.exports = {
            GameState: GameState
        };
    }, {} ],
    4: [ function(require, module, exports) {
        var Snap = require("snapsvg"), COLUMN_WIDTH = 18, PLAYER_HEIGHT = 16, CELL_HEIGHT = 12, PIPE_WIDTH = 2, RUNG_HEIGHT = 2, SCORE_BOX_HEIGHT = 10, COLORS = [ "#FF0000", "#0000FF", "#D91BF2", "#129631", "#FFD000" ];
        Snap.plugin(function(Snap, Element, Paper, glob, Fragment) {
            Paper.prototype.move = function(x, y) {
                return this.transform(new Snap.Matrix().translate(x, y));
            };
        });
        var OneCircleView = function() {
            function OneCircleView(svg, isTop) {
                _classCallCheck(this, OneCircleView), this.pipe = svg.rect(COLUMN_WIDTH / 2 - PIPE_WIDTH / 2, isTop ? PLAYER_HEIGHT / 2 : 0, PIPE_WIDTH, PLAYER_HEIGHT / 2), 
                this.pipe.attr({
                    fill: "#000000"
                }), this.circle = svg.circle(COLUMN_WIDTH / 2, PLAYER_HEIGHT / 2, 6), this.circle.attr({
                    fill: "#FFFFFF",
                    stroke: "#000000",
                    strokeWidth: 1
                }), this.text = svg.text(COLUMN_WIDTH / 2, PLAYER_HEIGHT / 2, "·"), this.text.attr({
                    textAnchor: "middle",
                    dominantBaseline: "central",
                    fontFamily: "Arial",
                    fontSize: 10
                });
            }
            return _createClass(OneCircleView, [ {
                key: "setColor",
                value: function(color) {
                    this.pipe.attr({
                        fill: color
                    }), this.circle.attr({
                        stroke: color
                    }), this.text.attr({
                        fill: color
                    });
                }
            }, {
                key: "setText",
                value: function(text) {
                    this.text.attr({
                        text: text
                    });
                }
            } ]), OneCircleView;
        }(), CirclesView = function() {
            function CirclesView(size, svg, isTop) {
                var _this = this;
                _classCallCheck(this, CirclesView), this._size = size + 1, this.circles = [];
                for (var i = 0; i < this._size; i++) {
                    var circleGroup = svg.group().move(COLUMN_WIDTH * i, 0);
                    circleGroup.attr({
                        cursor: "pointer"
                    }), circleGroup.click(function() {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                        return function(event) {
                            var _iteratorNormalCompletion3 = !0, _didIteratorError3 = !1, _iteratorError3 = void 0;
                            try {
                                for (var _step3, _iterator3 = _this.circleClickCallbacks[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = !0) {
                                    var callback = _step3.value;
                                    setTimeout.apply(void 0, [ callback, 0 ].concat(args));
                                }
                            } catch (err) {
                                _didIteratorError3 = !0, _iteratorError3 = err;
                            } finally {
                                try {
                                    !_iteratorNormalCompletion3 && _iterator3["return"] && _iterator3["return"]();
                                } finally {
                                    if (_didIteratorError3) throw _iteratorError3;
                                }
                            }
                            _this.circleClickCallbacks = [];
                        };
                    }(i)), this.circles.push(new OneCircleView(circleGroup, isTop));
                }
                this.circleClickCallbacks = [];
            }
            return _createClass(CirclesView, [ {
                key: "setColorFor",
                value: function(pos, color) {
                    this.circles[pos].setColor(color);
                }
            }, {
                key: "setTextFor",
                value: function(pos, text) {
                    this.circles[pos].setText(text);
                }
            }, {
                key: "onceCircleClicked",
                value: function(next) {
                    this.circleClickCallbacks.push(next);
                }
            } ]), CirclesView;
        }(), CellView = function() {
            function CellView(svg) {
                _classCallCheck(this, CellView), this.pipe1 = svg.rect(COLUMN_WIDTH / 2 - PIPE_WIDTH / 2, 0, PIPE_WIDTH, CELL_HEIGHT / 2), 
                this.pipe1.attr({
                    fill: "#000000"
                }), this.pipe2 = svg.rect(COLUMN_WIDTH / 2 - PIPE_WIDTH / 2, CELL_HEIGHT / 2, PIPE_WIDTH, CELL_HEIGHT / 2), 
                this.pipe2.attr({
                    fill: "#000000"
                });
            }
            return _createClass(CellView, [ {
                key: "setTopColor",
                value: function(color) {
                    this.pipe1.attr({
                        fill: color
                    });
                }
            }, {
                key: "setBottomColor",
                value: function(color) {
                    this.pipe2.attr({
                        fill: color
                    });
                }
            } ]), CellView;
        }(), RungView = function() {
            function RungView(svg) {
                _classCallCheck(this, RungView), this.rect1 = svg.rect(PIPE_WIDTH / 2, CELL_HEIGHT / 2 - RUNG_HEIGHT, COLUMN_WIDTH / 2 - PIPE_WIDTH / 2, RUNG_HEIGHT), 
                this.rect1.attr({
                    fill: "#D9D9D9"
                }), this.rect2 = svg.rect(PIPE_WIDTH / 2, CELL_HEIGHT / 2, COLUMN_WIDTH / 2 - PIPE_WIDTH / 2, RUNG_HEIGHT), 
                this.rect2.attr({
                    fill: "#D9D9D9"
                }), this.rect3 = svg.rect(COLUMN_WIDTH / 2, CELL_HEIGHT / 2 - RUNG_HEIGHT, COLUMN_WIDTH / 2 - PIPE_WIDTH / 2, RUNG_HEIGHT), 
                this.rect3.attr({
                    fill: "#D9D9D9"
                }), this.rect4 = svg.rect(COLUMN_WIDTH / 2, CELL_HEIGHT / 2, COLUMN_WIDTH / 2 - PIPE_WIDTH / 2, RUNG_HEIGHT), 
                this.rect4.attr({
                    fill: "#D9D9D9"
                }), this.circle = svg.circle(COLUMN_WIDTH / 2, CELL_HEIGHT / 2, 4), this.circle.attr({
                    fill: "#FFFFFF",
                    stroke: "#D9D9D9",
                    strokeWidth: 1
                }), this.text = svg.text(COLUMN_WIDTH / 2, CELL_HEIGHT / 2, "·"), this.text.attr({
                    textAnchor: "middle",
                    dominantBaseline: "central",
                    fontFamily: "Arial",
                    fontSize: 10,
                    fill: "#D9D9D9"
                });
            }
            return _createClass(RungView, [ {
                key: "setColors",
                value: function(color1, color2) {
                    this.rect1.attr({
                        fill: color1
                    }), this.rect2.attr({
                        fill: color2
                    }), this.rect3.attr({
                        fill: color2
                    }), this.rect4.attr({
                        fill: color1
                    }), this.circle.attr({
                        stroke: "#000000"
                    }), this.text.attr({
                        fill: "#000000"
                    });
                }
            }, {
                key: "setText",
                value: function(text) {
                    this.text.attr({
                        text: text
                    });
                }
            } ]), RungView;
        }(), GameView = function() {
            function GameView(size, id) {
                var _this2 = this;
                _classCallCheck(this, GameView), this.size = size, this.svg = Snap(id);
                var width = COLUMN_WIDTH * (size + 1), height = 2 * PLAYER_HEIGHT + size * CELL_HEIGHT + SCORE_BOX_HEIGHT;
                this.svg.attr({
                    viewBox: [ 0, 0, width, height ].join(" ")
                }), this.p1 = new CirclesView(size, this.svg.group().move(0, 0), (!0)), this.p2 = new CirclesView(size, this.svg.group().move(0, size * CELL_HEIGHT + PLAYER_HEIGHT), (!1)), 
                this.cells = [];
                for (var i = 0; i < size; i++) {
                    for (var row = [], j = 0; j < size + 1; j++) row.push(new CellView(this.svg.group().move(COLUMN_WIDTH * j, PLAYER_HEIGHT + CELL_HEIGHT * i)));
                    this.cells.push(row);
                }
                this.rungs = [];
                for (var _i = 0; _i < size; _i++) {
                    for (var _row = [], _j = 0; _j < size; _j++) {
                        var rungGroup = this.svg.group().move(COLUMN_WIDTH * _j + COLUMN_WIDTH / 2, PLAYER_HEIGHT + CELL_HEIGHT * _i);
                        rungGroup.attr({
                            cursor: "pointer"
                        }), rungGroup.click(function() {
                            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                            return function(event) {
                                var _iteratorNormalCompletion4 = !0, _didIteratorError4 = !1, _iteratorError4 = void 0;
                                try {
                                    for (var _step4, _iterator4 = _this2.rungClickCallbacks[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = !0) {
                                        var callback = _step4.value;
                                        setTimeout.apply(void 0, [ callback, 0 ].concat(args));
                                    }
                                } catch (err) {
                                    _didIteratorError4 = !0, _iteratorError4 = err;
                                } finally {
                                    try {
                                        !_iteratorNormalCompletion4 && _iterator4["return"] && _iterator4["return"]();
                                    } finally {
                                        if (_didIteratorError4) throw _iteratorError4;
                                    }
                                }
                                _this2.rungClickCallbacks = [];
                            };
                        }([ _i, _j ])), _row.push(new RungView(rungGroup));
                    }
                    this.rungs.push(_row);
                }
                this.rungClickCallbacks = [], this.scoreText = this.svg.text(width / 2, height - SCORE_BOX_HEIGHT / 2, "·"), 
                this.scoreText.attr({
                    textAnchor: "middle",
                    dominantBaseline: "central",
                    fontFamily: "Arial",
                    fontSize: 7,
                    fill: "#000000"
                });
            }
            return _createClass(GameView, [ {
                key: "setScore",
                value: function(score) {
                    this.scoreText.attr({
                        text: "Current Score: " + score
                    });
                }
            }, {
                key: "renderGameState",
                value: function(gameState) {
                    for (var size = this.size, matrix = gameState.rungs.getMatrix(), colors = COLORS.slice(0, size + 1), i = 0; i < size; i++) {
                        for (var j = 0; j <= size; j++) 0 === i && this.p1.setColorFor(j, colors[j]), this.cells[i][j].setTopColor(colors[j]);
                        for (var _j2 = 0; _j2 < size; _j2++) {
                            var rungText = "";
                            switch (matrix[i][_j2]) {
                              case "·":
                              case "—":
                                rungText = "·", rungText = "·";
                                break;

                              case "+":
                              case "*":
                                rungText = "+";
                            }
                            if (this.rungs[i][_j2].setText(rungText), "+" === matrix[i][_j2] || "—" === matrix[i][_j2]) {
                                this.rungs[i][_j2].setColors(colors[_j2], colors[_j2 + 1]);
                                var temp = colors[_j2];
                                colors[_j2] = colors[_j2 + 1], colors[_j2 + 1] = temp;
                            }
                        }
                        for (var _j3 = 0; _j3 <= size; _j3++) i === size - 1 && this.p2.setColorFor(_j3, colors[_j3]), 
                        this.cells[i][_j3].setBottomColor(colors[_j3]);
                    }
                    for (var p1positions = gameState.p1.getPositions(), p2positions = gameState.p2.getPositions(), _j4 = 0; _j4 <= size; _j4++) this.p1.setTextFor(_j4, p1positions[_j4]), 
                    this.p2.setTextFor(_j4, p2positions[_j4]);
                    this.setScore(gameState.getScore());
                }
            }, {
                key: "onceRungClicked",
                value: function(next) {
                    this.rungClickCallbacks.push(next);
                }
            } ]), GameView;
        }();
        module.exports = {
            GameView: GameView
        };
    }, {
        snapsvg: 9
    } ],
    5: [ function(require, module, exports) {
        (function(process, global) {
            !function(global, factory) {
                "object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? factory(exports) : "function" == typeof define && define.amd ? define([ "exports" ], factory) : factory(global.async = global.async || {});
            }(this, function(exports) {
                function apply(func, thisArg, args) {
                    var length = args.length;
                    switch (length) {
                      case 0:
                        return func.call(thisArg);

                      case 1:
                        return func.call(thisArg, args[0]);

                      case 2:
                        return func.call(thisArg, args[0], args[1]);

                      case 3:
                        return func.call(thisArg, args[0], args[1], args[2]);
                    }
                    return func.apply(thisArg, args);
                }
                function isObject(value) {
                    var type = "undefined" == typeof value ? "undefined" : _typeof(value);
                    return !!value && ("object" == type || "function" == type);
                }
                function isFunction(value) {
                    var tag = isObject(value) ? objectToString.call(value) : "";
                    return tag == funcTag || tag == genTag;
                }
                function isObjectLike(value) {
                    return !!value && "object" == ("undefined" == typeof value ? "undefined" : _typeof(value));
                }
                function isSymbol(value) {
                    return "symbol" == ("undefined" == typeof value ? "undefined" : _typeof(value)) || isObjectLike(value) && objectToString$1.call(value) == symbolTag;
                }
                function toNumber(value) {
                    if ("number" == typeof value) return value;
                    if (isSymbol(value)) return NAN;
                    if (isObject(value)) {
                        var other = isFunction(value.valueOf) ? value.valueOf() : value;
                        value = isObject(other) ? other + "" : other;
                    }
                    if ("string" != typeof value) return 0 === value ? value : +value;
                    value = value.replace(reTrim, "");
                    var isBinary = reIsBinary.test(value);
                    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
                }
                function toFinite(value) {
                    if (!value) return 0 === value ? value : 0;
                    if (value = toNumber(value), value === INFINITY || value === -INFINITY) {
                        var sign = value < 0 ? -1 : 1;
                        return sign * MAX_INTEGER;
                    }
                    return value === value ? value : 0;
                }
                function toInteger(value) {
                    var result = toFinite(value), remainder = result % 1;
                    return result === result ? remainder ? result - remainder : result : 0;
                }
                function rest(func, start) {
                    if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                    return start = nativeMax(void 0 === start ? func.length - 1 : toInteger(start), 0), 
                    function() {
                        for (var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length); ++index < length; ) array[index] = args[start + index];
                        switch (start) {
                          case 0:
                            return func.call(this, array);

                          case 1:
                            return func.call(this, args[0], array);

                          case 2:
                            return func.call(this, args[0], args[1], array);
                        }
                        var otherArgs = Array(start + 1);
                        for (index = -1; ++index < start; ) otherArgs[index] = args[index];
                        return otherArgs[start] = array, apply(func, this, otherArgs);
                    };
                }
                function initialParams(fn) {
                    return rest(function(args) {
                        var callback = args.pop();
                        fn.call(this, args, callback);
                    });
                }
                function applyEach$1(eachfn) {
                    return rest(function(fns, args) {
                        var go = initialParams(function(args, callback) {
                            var that = this;
                            return eachfn(fns, function(fn, cb) {
                                fn.apply(that, args.concat([ cb ]));
                            }, callback);
                        });
                        return args.length ? go.apply(this, args) : go;
                    });
                }
                function noop() {}
                function once(fn) {
                    return function() {
                        if (null !== fn) {
                            var callFn = fn;
                            fn = null, callFn.apply(this, arguments);
                        }
                    };
                }
                function baseProperty(key) {
                    return function(object) {
                        return null == object ? void 0 : object[key];
                    };
                }
                function isLength(value) {
                    return "number" == typeof value && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
                }
                function isArrayLike(value) {
                    return null != value && isLength(getLength(value)) && !isFunction(value);
                }
                function getIterator(coll) {
                    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
                }
                function getPrototype(value) {
                    return nativeGetPrototype(Object(value));
                }
                function baseHas(object, key) {
                    return null != object && (hasOwnProperty.call(object, key) || "object" == ("undefined" == typeof object ? "undefined" : _typeof(object)) && key in object && null === getPrototype(object));
                }
                function baseKeys(object) {
                    return nativeKeys(Object(object));
                }
                function baseTimes(n, iteratee) {
                    for (var index = -1, result = Array(n); ++index < n; ) result[index] = iteratee(index);
                    return result;
                }
                function isArrayLikeObject(value) {
                    return isObjectLike(value) && isArrayLike(value);
                }
                function isArguments(value) {
                    return isArrayLikeObject(value) && hasOwnProperty$1.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString$2.call(value) == argsTag);
                }
                function isString(value) {
                    return "string" == typeof value || !isArray(value) && isObjectLike(value) && objectToString$3.call(value) == stringTag;
                }
                function indexKeys(object) {
                    var length = object ? object.length : void 0;
                    return isLength(length) && (isArray(object) || isString(object) || isArguments(object)) ? baseTimes(length, String) : null;
                }
                function isIndex(value, length) {
                    return length = null == length ? MAX_SAFE_INTEGER$1 : length, !!length && ("number" == typeof value || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
                }
                function isPrototype(value) {
                    var Ctor = value && value.constructor, proto = "function" == typeof Ctor && Ctor.prototype || objectProto$5;
                    return value === proto;
                }
                function keys(object) {
                    var isProto = isPrototype(object);
                    if (!isProto && !isArrayLike(object)) return baseKeys(object);
                    var indexes = indexKeys(object), skipIndexes = !!indexes, result = indexes || [], length = result.length;
                    for (var key in object) !baseHas(object, key) || skipIndexes && ("length" == key || isIndex(key, length)) || isProto && "constructor" == key || result.push(key);
                    return result;
                }
                function iterator(coll) {
                    var len, i = -1;
                    if (isArrayLike(coll)) return len = coll.length, function() {
                        return i++, i < len ? {
                            value: coll[i],
                            key: i
                        } : null;
                    };
                    var iterate = getIterator(coll);
                    if (iterate) return function() {
                        var item = iterate.next();
                        return item.done ? null : (i++, {
                            value: item.value,
                            key: i
                        });
                    };
                    var okeys = keys(coll);
                    return len = okeys.length, function() {
                        i++;
                        var key = okeys[i];
                        return i < len ? {
                            value: coll[key],
                            key: key
                        } : null;
                    };
                }
                function onlyOnce(fn) {
                    return function() {
                        if (null === fn) throw new Error("Callback was already called.");
                        var callFn = fn;
                        fn = null, callFn.apply(this, arguments);
                    };
                }
                function _eachOfLimit(limit) {
                    return function(obj, iteratee, callback) {
                        callback = once(callback || noop), obj = obj || [];
                        var nextElem = iterator(obj);
                        if (limit <= 0) return callback(null);
                        var done = !1, running = 0, errored = !1;
                        !function replenish() {
                            if (done && running <= 0) return callback(null);
                            for (;running < limit && !errored; ) {
                                var elem = nextElem();
                                if (null === elem) return done = !0, void (running <= 0 && callback(null));
                                running += 1, iteratee(elem.value, elem.key, onlyOnce(function(err) {
                                    running -= 1, err ? (callback(err), errored = !0) : replenish();
                                }));
                            }
                        }();
                    };
                }
                function doParallelLimit(fn) {
                    return function(obj, limit, iteratee, callback) {
                        return fn(_eachOfLimit(limit), obj, iteratee, callback);
                    };
                }
                function _asyncMap(eachfn, arr, iteratee, callback) {
                    callback = once(callback || noop), arr = arr || [];
                    var results = [], counter = 0;
                    eachfn(arr, function(value, _, callback) {
                        var index = counter++;
                        iteratee(value, function(err, v) {
                            results[index] = v, callback(err);
                        });
                    }, function(err) {
                        callback(err, results);
                    });
                }
                function doLimit(fn, limit) {
                    return function(iterable, iteratee, callback) {
                        return fn(iterable, limit, iteratee, callback);
                    };
                }
                function asyncify(func) {
                    return initialParams(function(args, callback) {
                        var result;
                        try {
                            result = func.apply(this, args);
                        } catch (e) {
                            return callback(e);
                        }
                        isObject(result) && "function" == typeof result.then ? result.then(function(value) {
                            callback(null, value);
                        }, function(err) {
                            callback(err.message ? err : new Error(err));
                        }) : callback(null, result);
                    });
                }
                function arrayEach(array, iteratee) {
                    for (var index = -1, length = array ? array.length : 0; ++index < length && iteratee(array[index], index, array) !== !1; ) ;
                    return array;
                }
                function createBaseFor(fromRight) {
                    return function(object, iteratee, keysFunc) {
                        for (var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length; length--; ) {
                            var key = props[fromRight ? length : ++index];
                            if (iteratee(iterable[key], key, iterable) === !1) break;
                        }
                        return object;
                    };
                }
                function baseForOwn(object, iteratee) {
                    return object && baseFor(object, iteratee, keys);
                }
                function indexOfNaN(array, fromIndex, fromRight) {
                    for (var length = array.length, index = fromIndex + (fromRight ? 1 : -1); fromRight ? index-- : ++index < length; ) {
                        var other = array[index];
                        if (other !== other) return index;
                    }
                    return -1;
                }
                function baseIndexOf(array, value, fromIndex) {
                    if (value !== value) return indexOfNaN(array, fromIndex);
                    for (var index = fromIndex - 1, length = array.length; ++index < length; ) if (array[index] === value) return index;
                    return -1;
                }
                function auto(tasks, concurrency, callback) {
                    function enqueueTask(key, task) {
                        readyTasks.push(function() {
                            runTask(key, task);
                        });
                    }
                    function processQueue() {
                        if (0 === readyTasks.length && 0 === runningTasks) return callback(null, results);
                        for (;readyTasks.length && runningTasks < concurrency; ) {
                            var run = readyTasks.shift();
                            run();
                        }
                    }
                    function addListener(taskName, fn) {
                        var taskListeners = listeners[taskName];
                        taskListeners || (taskListeners = listeners[taskName] = []), taskListeners.push(fn);
                    }
                    function taskComplete(taskName) {
                        var taskListeners = listeners[taskName] || [];
                        arrayEach(taskListeners, function(fn) {
                            fn();
                        }), processQueue();
                    }
                    function runTask(key, task) {
                        if (!hasError) {
                            var taskCallback = onlyOnce(rest(function(err, args) {
                                if (runningTasks--, args.length <= 1 && (args = args[0]), err) {
                                    var safeResults = {};
                                    baseForOwn(results, function(val, rkey) {
                                        safeResults[rkey] = val;
                                    }), safeResults[key] = args, hasError = !0, listeners = [], callback(err, safeResults);
                                } else results[key] = args, taskComplete(key);
                            }));
                            runningTasks++;
                            var taskFn = task[task.length - 1];
                            task.length > 1 ? taskFn(results, taskCallback) : taskFn(taskCallback);
                        }
                    }
                    function checkForDeadlocks() {
                        for (var currentTask, counter = 0; readyToCheck.length; ) currentTask = readyToCheck.pop(), 
                        counter++, arrayEach(getDependents(currentTask), function(dependent) {
                            --uncheckedDependencies[dependent] || readyToCheck.push(dependent);
                        });
                        if (counter !== numTasks) throw new Error("async.auto cannot execute tasks due to a recursive dependency");
                    }
                    function getDependents(taskName) {
                        var result = [];
                        return baseForOwn(tasks, function(task, key) {
                            isArray(task) && baseIndexOf(task, taskName, 0) >= 0 && result.push(key);
                        }), result;
                    }
                    "function" == typeof concurrency && (callback = concurrency, concurrency = null), 
                    callback = once(callback || noop);
                    var keys$$ = keys(tasks), numTasks = keys$$.length;
                    if (!numTasks) return callback(null);
                    concurrency || (concurrency = numTasks);
                    var results = {}, runningTasks = 0, hasError = !1, listeners = {}, readyTasks = [], readyToCheck = [], uncheckedDependencies = {};
                    baseForOwn(tasks, function(task, key) {
                        if (!isArray(task)) return enqueueTask(key, [ task ]), void readyToCheck.push(key);
                        var dependencies = task.slice(0, task.length - 1), remainingDependencies = dependencies.length;
                        return 0 === remainingDependencies ? (enqueueTask(key, task), void readyToCheck.push(key)) : (uncheckedDependencies[key] = remainingDependencies, 
                        void arrayEach(dependencies, function(dependencyName) {
                            if (!tasks[dependencyName]) throw new Error("async.auto task `" + key + "` has a non-existent dependency in " + dependencies.join(", "));
                            addListener(dependencyName, function() {
                                remainingDependencies--, 0 === remainingDependencies && enqueueTask(key, task);
                            });
                        }));
                    }), checkForDeadlocks(), processQueue();
                }
                function arrayMap(array, iteratee) {
                    for (var index = -1, length = array ? array.length : 0, result = Array(length); ++index < length; ) result[index] = iteratee(array[index], index, array);
                    return result;
                }
                function copyArray(source, array) {
                    var index = -1, length = source.length;
                    for (array || (array = Array(length)); ++index < length; ) array[index] = source[index];
                    return array;
                }
                function checkGlobal(value) {
                    return value && value.Object === Object ? value : null;
                }
                function baseToString(value) {
                    if ("string" == typeof value) return value;
                    if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
                    var result = value + "";
                    return "0" == result && 1 / value == -INFINITY$1 ? "-0" : result;
                }
                function baseSlice(array, start, end) {
                    var index = -1, length = array.length;
                    start < 0 && (start = -start > length ? 0 : length + start), end = end > length ? length : end, 
                    end < 0 && (end += length), length = start > end ? 0 : end - start >>> 0, start >>>= 0;
                    for (var result = Array(length); ++index < length; ) result[index] = array[index + start];
                    return result;
                }
                function castSlice(array, start, end) {
                    var length = array.length;
                    return end = void 0 === end ? length : end, !start && end >= length ? array : baseSlice(array, start, end);
                }
                function charsEndIndex(strSymbols, chrSymbols) {
                    for (var index = strSymbols.length; index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1; ) ;
                    return index;
                }
                function charsStartIndex(strSymbols, chrSymbols) {
                    for (var index = -1, length = strSymbols.length; ++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1; ) ;
                    return index;
                }
                function stringToArray(string) {
                    return string.match(reComplexSymbol);
                }
                function toString(value) {
                    return null == value ? "" : baseToString(value);
                }
                function trim(string, chars, guard) {
                    if (string = toString(string), string && (guard || void 0 === chars)) return string.replace(reTrim$1, "");
                    if (!string || !(chars = baseToString(chars))) return string;
                    var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
                    return castSlice(strSymbols, start, end).join("");
                }
                function parseParams(func) {
                    return func = func.toString().replace(STRIP_COMMENTS, ""), func = func.match(FN_ARGS)[2].replace(" ", ""), 
                    func = func ? func.split(FN_ARG_SPLIT) : [], func = func.map(function(arg) {
                        return trim(arg.replace(FN_ARG, ""));
                    });
                }
                function autoInject(tasks, callback) {
                    var newTasks = {};
                    baseForOwn(tasks, function(taskFn, key) {
                        function newTask(results, taskCb) {
                            var newArgs = arrayMap(params, function(name) {
                                return results[name];
                            });
                            newArgs.push(taskCb), taskFn.apply(null, newArgs);
                        }
                        var params;
                        if (isArray(taskFn)) params = copyArray(taskFn), taskFn = params.pop(), newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn); else if (1 === taskFn.length) newTasks[key] = taskFn; else {
                            if (params = parseParams(taskFn), 0 === taskFn.length && 0 === params.length) throw new Error("autoInject task functions require explicit parameters.");
                            params.pop(), newTasks[key] = params.concat(newTask);
                        }
                    }), auto(newTasks, callback);
                }
                function fallback(fn) {
                    setTimeout(fn, 0);
                }
                function wrap(defer) {
                    return rest(function(fn, args) {
                        defer(function() {
                            fn.apply(null, args);
                        });
                    });
                }
                function DLL() {
                    this.head = this.tail = null, this.length = 0;
                }
                function setInitial(dll, node) {
                    dll.length = 1, dll.head = dll.tail = node;
                }
                function queue(worker, concurrency, payload) {
                    function _insert(data, pos, callback) {
                        if (null != callback && "function" != typeof callback) throw new Error("task callback must be a function");
                        return q.started = !0, isArray(data) || (data = [ data ]), 0 === data.length && q.idle() ? setImmediate$1(function() {
                            q.drain();
                        }) : (arrayEach(data, function(task) {
                            var item = {
                                data: task,
                                callback: callback || noop
                            };
                            pos ? q._tasks.unshift(item) : q._tasks.push(item);
                        }), void setImmediate$1(q.process));
                    }
                    function _next(tasks) {
                        return rest(function(args) {
                            workers -= 1, arrayEach(tasks, function(task) {
                                arrayEach(_workersList, function(worker, index) {
                                    if (worker === task) return _workersList.splice(index, 1), !1;
                                }), task.callback.apply(task, args), null != args[0] && q.error(args[0], task.data);
                            }), workers <= q.concurrency - q.buffer && q.unsaturated(), q.idle() && q.drain(), 
                            q.process();
                        });
                    }
                    if (null == concurrency) concurrency = 1; else if (0 === concurrency) throw new Error("Concurrency must not be zero");
                    var workers = 0, _workersList = [], q = {
                        _tasks: new DLL(),
                        concurrency: concurrency,
                        payload: payload,
                        saturated: noop,
                        unsaturated: noop,
                        buffer: concurrency / 4,
                        empty: noop,
                        drain: noop,
                        error: noop,
                        started: !1,
                        paused: !1,
                        push: function(data, callback) {
                            _insert(data, !1, callback);
                        },
                        kill: function() {
                            q.drain = noop, q._tasks.empty();
                        },
                        unshift: function(data, callback) {
                            _insert(data, !0, callback);
                        },
                        process: function() {
                            for (;!q.paused && workers < q.concurrency && q._tasks.length; ) {
                                var tasks = [], data = [], l = q._tasks.length;
                                q.payload && (l = Math.min(l, q.payload));
                                for (var i = 0; i < l; i++) {
                                    var node = q._tasks.shift();
                                    tasks.push(node), data.push(node.data);
                                }
                                0 === q._tasks.length && q.empty(), workers += 1, _workersList.push(tasks[0]), workers === q.concurrency && q.saturated();
                                var cb = onlyOnce(_next(tasks));
                                worker(data, cb);
                            }
                        },
                        length: function() {
                            return q._tasks.length;
                        },
                        running: function() {
                            return workers;
                        },
                        workersList: function() {
                            return _workersList;
                        },
                        idle: function() {
                            return q._tasks.length + workers === 0;
                        },
                        pause: function() {
                            q.paused = !0;
                        },
                        resume: function() {
                            if (q.paused !== !1) {
                                q.paused = !1;
                                for (var resumeCount = Math.min(q.concurrency, q._tasks.length), w = 1; w <= resumeCount; w++) setImmediate$1(q.process);
                            }
                        }
                    };
                    return q;
                }
                function cargo(worker, payload) {
                    return queue(worker, 1, payload);
                }
                function eachOfLimit(coll, limit, iteratee, callback) {
                    _eachOfLimit(limit)(coll, iteratee, callback);
                }
                function reduce(coll, memo, iteratee, callback) {
                    callback = once(callback || noop), eachOfSeries(coll, function(x, i, callback) {
                        iteratee(memo, x, function(err, v) {
                            memo = v, callback(err);
                        });
                    }, function(err) {
                        callback(err, memo);
                    });
                }
                function concat$1(eachfn, arr, fn, callback) {
                    var result = [];
                    eachfn(arr, function(x, index, cb) {
                        fn(x, function(err, y) {
                            result = result.concat(y || []), cb(err);
                        });
                    }, function(err) {
                        callback(err, result);
                    });
                }
                function doParallel(fn) {
                    return function(obj, iteratee, callback) {
                        return fn(eachOf, obj, iteratee, callback);
                    };
                }
                function doSeries(fn) {
                    return function(obj, iteratee, callback) {
                        return fn(eachOfSeries, obj, iteratee, callback);
                    };
                }
                function identity(value) {
                    return value;
                }
                function _createTester(eachfn, check, getResult) {
                    return function(arr, limit, iteratee, cb) {
                        function done(err) {
                            cb && (err ? cb(err) : cb(null, getResult(!1)));
                        }
                        function wrappedIteratee(x, _, callback) {
                            return cb ? void iteratee(x, function(err, v) {
                                cb && (err ? (cb(err), cb = iteratee = !1) : check(v) && (cb(null, getResult(!0, x)), 
                                cb = iteratee = !1)), callback();
                            }) : callback();
                        }
                        arguments.length > 3 ? (cb = cb || noop, eachfn(arr, limit, wrappedIteratee, done)) : (cb = iteratee, 
                        cb = cb || noop, iteratee = limit, eachfn(arr, wrappedIteratee, done));
                    };
                }
                function _findGetResult(v, x) {
                    return x;
                }
                function consoleFunc(name) {
                    return rest(function(fn, args) {
                        fn.apply(null, args.concat([ rest(function(err, args) {
                            "object" === ("undefined" == typeof console ? "undefined" : _typeof(console)) && (err ? console.error && console.error(err) : console[name] && arrayEach(args, function(x) {
                                console[name](x);
                            }));
                        }) ]));
                    });
                }
                function doDuring(fn, test, callback) {
                    function check(err, truth) {
                        return err ? callback(err) : truth ? void fn(next) : callback(null);
                    }
                    callback = onlyOnce(callback || noop);
                    var next = rest(function(err, args) {
                        return err ? callback(err) : (args.push(check), void test.apply(this, args));
                    });
                    check(null, !0);
                }
                function doWhilst(iteratee, test, callback) {
                    callback = onlyOnce(callback || noop);
                    var next = rest(function(err, args) {
                        return err ? callback(err) : test.apply(this, args) ? iteratee(next) : void callback.apply(null, [ null ].concat(args));
                    });
                    iteratee(next);
                }
                function doUntil(fn, test, callback) {
                    doWhilst(fn, function() {
                        return !test.apply(this, arguments);
                    }, callback);
                }
                function during(test, fn, callback) {
                    function next(err) {
                        return err ? callback(err) : void test(check);
                    }
                    function check(err, truth) {
                        return err ? callback(err) : truth ? void fn(next) : callback(null);
                    }
                    callback = onlyOnce(callback || noop), test(check);
                }
                function _withoutIndex(iteratee) {
                    return function(value, index, callback) {
                        return iteratee(value, callback);
                    };
                }
                function eachLimit(coll, limit, iteratee, callback) {
                    _eachOfLimit(limit)(coll, _withoutIndex(iteratee), callback);
                }
                function ensureAsync(fn) {
                    return initialParams(function(args, callback) {
                        var sync = !0;
                        args.push(function() {
                            var innerArgs = arguments;
                            sync ? setImmediate$1(function() {
                                callback.apply(null, innerArgs);
                            }) : callback.apply(null, innerArgs);
                        }), fn.apply(this, args), sync = !1;
                    });
                }
                function notId(v) {
                    return !v;
                }
                function _filter(eachfn, arr, iteratee, callback) {
                    callback = once(callback || noop);
                    var results = [];
                    eachfn(arr, function(x, index, callback) {
                        iteratee(x, function(err, v) {
                            err ? callback(err) : (v && results.push({
                                index: index,
                                value: x
                            }), callback());
                        });
                    }, function(err) {
                        err ? callback(err) : callback(null, arrayMap(results.sort(function(a, b) {
                            return a.index - b.index;
                        }), baseProperty("value")));
                    });
                }
                function forever(fn, errback) {
                    function next(err) {
                        return err ? done(err) : void task(next);
                    }
                    var done = onlyOnce(errback || noop), task = ensureAsync(fn);
                    next();
                }
                function mapValuesLimit(obj, limit, iteratee, callback) {
                    callback = once(callback || noop);
                    var newObj = {};
                    eachOfLimit(obj, limit, function(val, key, next) {
                        iteratee(val, key, function(err, result) {
                            return err ? next(err) : (newObj[key] = result, void next());
                        });
                    }, function(err) {
                        callback(err, newObj);
                    });
                }
                function has(obj, key) {
                    return key in obj;
                }
                function memoize(fn, hasher) {
                    var memo = Object.create(null), queues = Object.create(null);
                    hasher = hasher || identity;
                    var memoized = initialParams(function(args, callback) {
                        var key = hasher.apply(null, args);
                        has(memo, key) ? setImmediate$1(function() {
                            callback.apply(null, memo[key]);
                        }) : has(queues, key) ? queues[key].push(callback) : (queues[key] = [ callback ], 
                        fn.apply(null, args.concat([ rest(function(args) {
                            memo[key] = args;
                            var q = queues[key];
                            delete queues[key];
                            for (var i = 0, l = q.length; i < l; i++) q[i].apply(null, args);
                        }) ])));
                    });
                    return memoized.memo = memo, memoized.unmemoized = fn, memoized;
                }
                function _parallel(eachfn, tasks, callback) {
                    callback = callback || noop;
                    var results = isArrayLike(tasks) ? [] : {};
                    eachfn(tasks, function(task, key, callback) {
                        task(rest(function(err, args) {
                            args.length <= 1 && (args = args[0]), results[key] = args, callback(err);
                        }));
                    }, function(err) {
                        callback(err, results);
                    });
                }
                function parallelLimit(tasks, limit, callback) {
                    _parallel(_eachOfLimit(limit), tasks, callback);
                }
                function queue$1(worker, concurrency) {
                    return queue(function(items, cb) {
                        worker(items[0], cb);
                    }, concurrency, 1);
                }
                function priorityQueue(worker, concurrency) {
                    var q = queue$1(worker, concurrency);
                    return q.push = function(data, priority, callback) {
                        if (null == callback && (callback = noop), "function" != typeof callback) throw new Error("task callback must be a function");
                        if (q.started = !0, isArray(data) || (data = [ data ]), 0 === data.length) return setImmediate$1(function() {
                            q.drain();
                        });
                        priority = priority || 0;
                        for (var nextNode = q._tasks.head; nextNode && priority >= nextNode.priority; ) nextNode = nextNode.next;
                        arrayEach(data, function(task) {
                            var item = {
                                data: task,
                                priority: priority,
                                callback: callback
                            };
                            nextNode ? q._tasks.insertBefore(nextNode, item) : q._tasks.push(item);
                        }), setImmediate$1(q.process);
                    }, delete q.unshift, q;
                }
                function race(tasks, callback) {
                    return callback = once(callback || noop), isArray(tasks) ? tasks.length ? void arrayEach(tasks, function(task) {
                        task(callback);
                    }) : callback() : callback(new TypeError("First argument to race must be an array of functions"));
                }
                function reduceRight(array, memo, iteratee, callback) {
                    var reversed = slice.call(array).reverse();
                    reduce(reversed, memo, iteratee, callback);
                }
                function reflect(fn) {
                    return initialParams(function(args, reflectCallback) {
                        return args.push(rest(function(err, cbArgs) {
                            if (err) reflectCallback(null, {
                                error: err
                            }); else {
                                var value = null;
                                1 === cbArgs.length ? value = cbArgs[0] : cbArgs.length > 1 && (value = cbArgs), 
                                reflectCallback(null, {
                                    value: value
                                });
                            }
                        })), fn.apply(this, args);
                    });
                }
                function reject$1(eachfn, arr, iteratee, callback) {
                    _filter(eachfn, arr, function(value, cb) {
                        iteratee(value, function(err, v) {
                            err ? cb(err) : cb(null, !v);
                        });
                    }, callback);
                }
                function reflectAll(tasks) {
                    var results;
                    return isArray(tasks) ? results = arrayMap(tasks, reflect) : (results = {}, baseForOwn(tasks, function(task, key) {
                        results[key] = reflect.call(this, task);
                    })), results;
                }
                function constant$1(value) {
                    return function() {
                        return value;
                    };
                }
                function retry(opts, task, callback) {
                    function parseTimes(acc, t) {
                        if ("object" === ("undefined" == typeof t ? "undefined" : _typeof(t))) acc.times = +t.times || DEFAULT_TIMES, 
                        acc.intervalFunc = "function" == typeof t.interval ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL); else {
                            if ("number" != typeof t && "string" != typeof t) throw new Error("Invalid arguments for async.retry");
                            acc.times = +t || DEFAULT_TIMES;
                        }
                    }
                    function retryAttempt() {
                        task(function(err) {
                            err && attempt++ < options.times ? setTimeout(retryAttempt, options.intervalFunc(attempt)) : callback.apply(null, arguments);
                        });
                    }
                    var DEFAULT_TIMES = 5, DEFAULT_INTERVAL = 0, options = {
                        times: DEFAULT_TIMES,
                        intervalFunc: constant$1(DEFAULT_INTERVAL)
                    };
                    if (arguments.length < 3 && "function" == typeof opts ? (callback = task || noop, 
                    task = opts) : (parseTimes(options, opts), callback = callback || noop), "function" != typeof task) throw new Error("Invalid arguments for async.retry");
                    var attempt = 1;
                    retryAttempt();
                }
                function retryable(opts, task) {
                    return task || (task = opts, opts = null), initialParams(function(args, callback) {
                        function taskFn(cb) {
                            task.apply(null, args.concat([ cb ]));
                        }
                        opts ? retry(opts, taskFn, callback) : retry(taskFn, callback);
                    });
                }
                function series(tasks, callback) {
                    _parallel(eachOfSeries, tasks, callback);
                }
                function sortBy(coll, iteratee, callback) {
                    function comparator(left, right) {
                        var a = left.criteria, b = right.criteria;
                        return a < b ? -1 : a > b ? 1 : 0;
                    }
                    map(coll, function(x, callback) {
                        iteratee(x, function(err, criteria) {
                            return err ? callback(err) : void callback(null, {
                                value: x,
                                criteria: criteria
                            });
                        });
                    }, function(err, results) {
                        return err ? callback(err) : void callback(null, arrayMap(results.sort(comparator), baseProperty("value")));
                    });
                }
                function timeout(asyncFn, milliseconds, info) {
                    function injectedCallback() {
                        timedOut || (originalCallback.apply(null, arguments), clearTimeout(timer));
                    }
                    function timeoutCallback() {
                        var name = asyncFn.name || "anonymous", error = new Error('Callback function "' + name + '" timed out.');
                        error.code = "ETIMEDOUT", info && (error.info = info), timedOut = !0, originalCallback(error);
                    }
                    var originalCallback, timer, timedOut = !1;
                    return initialParams(function(args, origCallback) {
                        originalCallback = origCallback, timer = setTimeout(timeoutCallback, milliseconds), 
                        asyncFn.apply(null, args.concat(injectedCallback));
                    });
                }
                function baseRange(start, end, step, fromRight) {
                    for (var index = -1, length = nativeMax$1(nativeCeil((end - start) / (step || 1)), 0), result = Array(length); length--; ) result[fromRight ? length : ++index] = start, 
                    start += step;
                    return result;
                }
                function timeLimit(count, limit, iteratee, callback) {
                    mapLimit(baseRange(0, count, 1), limit, iteratee, callback);
                }
                function transform(coll, accumulator, iteratee, callback) {
                    3 === arguments.length && (callback = iteratee, iteratee = accumulator, accumulator = isArray(coll) ? [] : {}), 
                    callback = once(callback || noop), eachOf(coll, function(v, k, cb) {
                        iteratee(accumulator, v, k, cb);
                    }, function(err) {
                        callback(err, accumulator);
                    });
                }
                function unmemoize(fn) {
                    return function() {
                        return (fn.unmemoized || fn).apply(null, arguments);
                    };
                }
                function whilst(test, iteratee, callback) {
                    if (callback = onlyOnce(callback || noop), !test()) return callback(null);
                    var next = rest(function(err, args) {
                        return err ? callback(err) : test() ? iteratee(next) : void callback.apply(null, [ null ].concat(args));
                    });
                    iteratee(next);
                }
                function until(test, fn, callback) {
                    whilst(function() {
                        return !test.apply(this, arguments);
                    }, fn, callback);
                }
                function waterfall(tasks, callback) {
                    function nextTask(args) {
                        if (taskIndex === tasks.length) return callback.apply(null, [ null ].concat(args));
                        var taskCallback = onlyOnce(rest(function(err, args) {
                            return err ? callback.apply(null, [ err ].concat(args)) : void nextTask(args);
                        }));
                        args.push(taskCallback);
                        var task = tasks[taskIndex++];
                        task.apply(null, args);
                    }
                    if (callback = once(callback || noop), !isArray(tasks)) return callback(new Error("First argument to waterfall must be an array of functions"));
                    if (!tasks.length) return callback();
                    var taskIndex = 0;
                    nextTask([]);
                }
                var _defer, funcTag = "[object Function]", genTag = "[object GeneratorFunction]", objectProto = Object.prototype, objectToString = objectProto.toString, symbolTag = "[object Symbol]", objectProto$1 = Object.prototype, objectToString$1 = objectProto$1.toString, NAN = NaN, reTrim = /^\s+|\s+$/g, reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsOctal = /^0o[0-7]+$/i, freeParseInt = parseInt, INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e308, FUNC_ERROR_TEXT = "Expected a function", nativeMax = Math.max, getLength = baseProperty("length"), MAX_SAFE_INTEGER = 9007199254740991, iteratorSymbol = "function" == typeof Symbol && Symbol.iterator, nativeGetPrototype = Object.getPrototypeOf, objectProto$2 = Object.prototype, hasOwnProperty = objectProto$2.hasOwnProperty, nativeKeys = Object.keys, argsTag = "[object Arguments]", objectProto$3 = Object.prototype, hasOwnProperty$1 = objectProto$3.hasOwnProperty, objectToString$2 = objectProto$3.toString, propertyIsEnumerable = objectProto$3.propertyIsEnumerable, isArray = Array.isArray, stringTag = "[object String]", objectProto$4 = Object.prototype, objectToString$3 = objectProto$4.toString, MAX_SAFE_INTEGER$1 = 9007199254740991, reIsUint = /^(?:0|[1-9]\d*)$/, objectProto$5 = Object.prototype, mapLimit = doParallelLimit(_asyncMap), map = doLimit(mapLimit, 1 / 0), applyEach = applyEach$1(map), mapSeries = doLimit(mapLimit, 1), applyEachSeries = applyEach$1(mapSeries), apply$1 = rest(function(fn, args) {
                    return rest(function(callArgs) {
                        return fn.apply(null, args.concat(callArgs));
                    });
                }), baseFor = createBaseFor(), freeGlobal = checkGlobal("object" == ("undefined" == typeof global ? "undefined" : _typeof(global)) && global), freeSelf = checkGlobal("object" == ("undefined" == typeof self ? "undefined" : _typeof(self)) && self), thisGlobal = checkGlobal("object" == _typeof(this) && this), root = freeGlobal || freeSelf || thisGlobal || Function("return this")(), Symbol$1 = root.Symbol, INFINITY$1 = 1 / 0, symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0, rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23", rsComboSymbolsRange = "\\u20d0-\\u20f0", rsVarRange = "\\ufe0e\\ufe0f", rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [ rsNonAstral, rsRegional, rsSurrPair ].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [ rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral ].join("|") + ")", reComplexSymbol = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g"), reTrim$1 = /^\s+|\s+$/g, FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m, FN_ARG_SPLIT = /,/, FN_ARG = /(=.+)?(\s*)$/, STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, hasSetImmediate = "function" == typeof setImmediate && setImmediate, hasNextTick = "object" === ("undefined" == typeof process ? "undefined" : _typeof(process)) && "function" == typeof process.nextTick;
                _defer = hasSetImmediate ? setImmediate : hasNextTick ? process.nextTick : fallback;
                var setImmediate$1 = wrap(_defer);
                DLL.prototype.removeLink = function(node) {
                    return node.prev ? node.prev.next = node.next : this.head = node.next, node.next ? node.next.prev = node.prev : this.tail = node.prev, 
                    node.prev = node.next = null, this.length -= 1, node;
                }, DLL.prototype.empty = DLL, DLL.prototype.insertAfter = function(node, newNode) {
                    newNode.prev = node, newNode.next = node.next, node.next ? node.next.prev = newNode : this.tail = newNode, 
                    node.next = newNode, this.length += 1;
                }, DLL.prototype.insertBefore = function(node, newNode) {
                    newNode.prev = node.prev, newNode.next = node, node.prev ? node.prev.next = newNode : this.head = newNode, 
                    node.prev = newNode, this.length += 1;
                }, DLL.prototype.unshift = function(node) {
                    this.head ? this.insertBefore(this.head, node) : setInitial(this, node);
                }, DLL.prototype.push = function(node) {
                    this.tail ? this.insertAfter(this.tail, node) : setInitial(this, node);
                }, DLL.prototype.shift = function() {
                    return this.head && this.removeLink(this.head);
                }, DLL.prototype.pop = function() {
                    return this.tail && this.removeLink(this.tail);
                };
                var _defer$1, eachOfSeries = doLimit(eachOfLimit, 1), seq = rest(function(functions) {
                    return rest(function(args) {
                        var that = this, cb = args[args.length - 1];
                        "function" == typeof cb ? args.pop() : cb = noop, reduce(functions, args, function(newargs, fn, cb) {
                            fn.apply(that, newargs.concat([ rest(function(err, nextargs) {
                                cb(err, nextargs);
                            }) ]));
                        }, function(err, results) {
                            cb.apply(that, [ err ].concat(results));
                        });
                    });
                }), compose = rest(function(args) {
                    return seq.apply(null, args.reverse());
                }), eachOf = doLimit(eachOfLimit, 1 / 0), concat = doParallel(concat$1), concatSeries = doSeries(concat$1), constant = rest(function(values) {
                    var args = [ null ].concat(values);
                    return initialParams(function(ignoredArgs, callback) {
                        return callback.apply(this, args);
                    });
                }), detect = _createTester(eachOf, identity, _findGetResult), detectLimit = _createTester(eachOfLimit, identity, _findGetResult), detectSeries = _createTester(eachOfSeries, identity, _findGetResult), dir = consoleFunc("dir"), each = doLimit(eachLimit, 1 / 0), eachSeries = doLimit(eachLimit, 1), everyLimit = _createTester(eachOfLimit, notId, notId), every = doLimit(everyLimit, 1 / 0), everySeries = doLimit(everyLimit, 1), filterLimit = doParallelLimit(_filter), filter = doLimit(filterLimit, 1 / 0), filterSeries = doLimit(filterLimit, 1), log = consoleFunc("log"), mapValues = doLimit(mapValuesLimit, 1 / 0), mapValuesSeries = doLimit(mapValuesLimit, 1);
                _defer$1 = hasNextTick ? process.nextTick : hasSetImmediate ? setImmediate : fallback;
                var nextTick = wrap(_defer$1), parallel = doLimit(parallelLimit, 1 / 0), slice = Array.prototype.slice, rejectLimit = doParallelLimit(reject$1), reject = doLimit(rejectLimit, 1 / 0), rejectSeries = doLimit(rejectLimit, 1), someLimit = _createTester(eachOfLimit, Boolean, identity), some = doLimit(someLimit, 1 / 0), someSeries = doLimit(someLimit, 1), nativeCeil = Math.ceil, nativeMax$1 = Math.max, times = doLimit(timeLimit, 1 / 0), timesSeries = doLimit(timeLimit, 1), index = {
                    applyEach: applyEach,
                    applyEachSeries: applyEachSeries,
                    apply: apply$1,
                    asyncify: asyncify,
                    auto: auto,
                    autoInject: autoInject,
                    cargo: cargo,
                    compose: compose,
                    concat: concat,
                    concatSeries: concatSeries,
                    constant: constant,
                    detect: detect,
                    detectLimit: detectLimit,
                    detectSeries: detectSeries,
                    dir: dir,
                    doDuring: doDuring,
                    doUntil: doUntil,
                    doWhilst: doWhilst,
                    during: during,
                    each: each,
                    eachLimit: eachLimit,
                    eachOf: eachOf,
                    eachOfLimit: eachOfLimit,
                    eachOfSeries: eachOfSeries,
                    eachSeries: eachSeries,
                    ensureAsync: ensureAsync,
                    every: every,
                    everyLimit: everyLimit,
                    everySeries: everySeries,
                    filter: filter,
                    filterLimit: filterLimit,
                    filterSeries: filterSeries,
                    forever: forever,
                    log: log,
                    map: map,
                    mapLimit: mapLimit,
                    mapSeries: mapSeries,
                    mapValues: mapValues,
                    mapValuesLimit: mapValuesLimit,
                    mapValuesSeries: mapValuesSeries,
                    memoize: memoize,
                    nextTick: nextTick,
                    parallel: parallel,
                    parallelLimit: parallelLimit,
                    priorityQueue: priorityQueue,
                    queue: queue$1,
                    race: race,
                    reduce: reduce,
                    reduceRight: reduceRight,
                    reflect: reflect,
                    reflectAll: reflectAll,
                    reject: reject,
                    rejectLimit: rejectLimit,
                    rejectSeries: rejectSeries,
                    retry: retry,
                    retryable: retryable,
                    seq: seq,
                    series: series,
                    setImmediate: setImmediate$1,
                    some: some,
                    someLimit: someLimit,
                    someSeries: someSeries,
                    sortBy: sortBy,
                    timeout: timeout,
                    times: times,
                    timesLimit: timeLimit,
                    timesSeries: timesSeries,
                    transform: transform,
                    unmemoize: unmemoize,
                    until: until,
                    waterfall: waterfall,
                    whilst: whilst,
                    all: every,
                    any: some,
                    forEach: each,
                    forEachSeries: eachSeries,
                    forEachLimit: eachLimit,
                    forEachOf: eachOf,
                    forEachOfSeries: eachOfSeries,
                    forEachOfLimit: eachOfLimit,
                    inject: reduce,
                    foldl: reduce,
                    foldr: reduceRight,
                    select: filter,
                    selectLimit: filterLimit,
                    selectSeries: filterSeries,
                    wrapSync: asyncify
                };
                exports["default"] = index, exports.applyEach = applyEach, exports.applyEachSeries = applyEachSeries, 
                exports.apply = apply$1, exports.asyncify = asyncify, exports.auto = auto, exports.autoInject = autoInject, 
                exports.cargo = cargo, exports.compose = compose, exports.concat = concat, exports.concatSeries = concatSeries, 
                exports.constant = constant, exports.detect = detect, exports.detectLimit = detectLimit, 
                exports.detectSeries = detectSeries, exports.dir = dir, exports.doDuring = doDuring, 
                exports.doUntil = doUntil, exports.doWhilst = doWhilst, exports.during = during, 
                exports.each = each, exports.eachLimit = eachLimit, exports.eachOf = eachOf, exports.eachOfLimit = eachOfLimit, 
                exports.eachOfSeries = eachOfSeries, exports.eachSeries = eachSeries, exports.ensureAsync = ensureAsync, 
                exports.every = every, exports.everyLimit = everyLimit, exports.everySeries = everySeries, 
                exports.filter = filter, exports.filterLimit = filterLimit, exports.filterSeries = filterSeries, 
                exports.forever = forever, exports.log = log, exports.map = map, exports.mapLimit = mapLimit, 
                exports.mapSeries = mapSeries, exports.mapValues = mapValues, exports.mapValuesLimit = mapValuesLimit, 
                exports.mapValuesSeries = mapValuesSeries, exports.memoize = memoize, exports.nextTick = nextTick, 
                exports.parallel = parallel, exports.parallelLimit = parallelLimit, exports.priorityQueue = priorityQueue, 
                exports.queue = queue$1, exports.race = race, exports.reduce = reduce, exports.reduceRight = reduceRight, 
                exports.reflect = reflect, exports.reflectAll = reflectAll, exports.reject = reject, 
                exports.rejectLimit = rejectLimit, exports.rejectSeries = rejectSeries, exports.retry = retry, 
                exports.retryable = retryable, exports.seq = seq, exports.series = series, exports.setImmediate = setImmediate$1, 
                exports.some = some, exports.someLimit = someLimit, exports.someSeries = someSeries, 
                exports.sortBy = sortBy, exports.timeout = timeout, exports.times = times, exports.timesLimit = timeLimit, 
                exports.timesSeries = timesSeries, exports.transform = transform, exports.unmemoize = unmemoize, 
                exports.until = until, exports.waterfall = waterfall, exports.whilst = whilst, exports.all = every, 
                exports.allLimit = everyLimit, exports.allSeries = everySeries, exports.any = some, 
                exports.anyLimit = someLimit, exports.anySeries = someSeries, exports.find = detect, 
                exports.findLimit = detectLimit, exports.findSeries = detectSeries, exports.forEach = each, 
                exports.forEachSeries = eachSeries, exports.forEachLimit = eachLimit, exports.forEachOf = eachOf, 
                exports.forEachOfSeries = eachOfSeries, exports.forEachOfLimit = eachOfLimit, exports.inject = reduce, 
                exports.foldl = reduce, exports.foldr = reduceRight, exports.select = filter, exports.selectLimit = filterLimit, 
                exports.selectSeries = filterSeries, exports.wrapSync = asyncify;
            });
        }).call(this, require("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
        _process: 8
    } ],
    6: [ function(require, module, exports) {
        !function(glob) {
            var current_event, stop, version = "0.4.2", has = "hasOwnProperty", separator = /[\.\/]/, comaseparator = /\s*,\s*/, wildcard = "*", numsort = function(a, b) {
                return a - b;
            }, events = {
                n: {}
            }, firstDefined = function() {
                for (var i = 0, ii = this.length; i < ii; i++) if ("undefined" != typeof this[i]) return this[i];
            }, lastDefined = function() {
                for (var i = this.length; --i; ) if ("undefined" != typeof this[i]) return this[i];
            }, eve = function eve(name, scope) {
                name = String(name);
                var l, oldstop = stop, args = Array.prototype.slice.call(arguments, 2), listeners = eve.listeners(name), z = 0, indexed = [], queue = {}, out = [], ce = current_event;
                out.firstDefined = firstDefined, out.lastDefined = lastDefined, current_event = name, 
                stop = 0;
                for (var i = 0, ii = listeners.length; i < ii; i++) "zIndex" in listeners[i] && (indexed.push(listeners[i].zIndex), 
                listeners[i].zIndex < 0 && (queue[listeners[i].zIndex] = listeners[i]));
                for (indexed.sort(numsort); indexed[z] < 0; ) if (l = queue[indexed[z++]], out.push(l.apply(scope, args)), 
                stop) return stop = oldstop, out;
                for (i = 0; i < ii; i++) if (l = listeners[i], "zIndex" in l) if (l.zIndex == indexed[z]) {
                    if (out.push(l.apply(scope, args)), stop) break;
                    do if (z++, l = queue[indexed[z]], l && out.push(l.apply(scope, args)), stop) break; while (l);
                } else queue[l.zIndex] = l; else if (out.push(l.apply(scope, args)), stop) break;
                return stop = oldstop, current_event = ce, out;
            };
            eve._events = events, eve.listeners = function(name) {
                var item, items, k, i, ii, j, jj, nes, names = name.split(separator), e = events, es = [ e ], out = [];
                for (i = 0, ii = names.length; i < ii; i++) {
                    for (nes = [], j = 0, jj = es.length; j < jj; j++) for (e = es[j].n, items = [ e[names[i]], e[wildcard] ], 
                    k = 2; k--; ) item = items[k], item && (nes.push(item), out = out.concat(item.f || []));
                    es = nes;
                }
                return out;
            }, eve.on = function(name, f) {
                if (name = String(name), "function" != typeof f) return function() {};
                for (var names = name.split(comaseparator), i = 0, ii = names.length; i < ii; i++) !function(name) {
                    for (var exist, names = name.split(separator), e = events, i = 0, ii = names.length; i < ii; i++) e = e.n, 
                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {
                        n: {}
                    });
                    for (e.f = e.f || [], i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                        exist = !0;
                        break;
                    }
                    !exist && e.f.push(f);
                }(names[i]);
                return function(zIndex) {
                    +zIndex == +zIndex && (f.zIndex = +zIndex);
                };
            }, eve.f = function(event) {
                var attrs = [].slice.call(arguments, 1);
                return function() {
                    eve.apply(null, [ event, null ].concat(attrs).concat([].slice.call(arguments, 0)));
                };
            }, eve.stop = function() {
                stop = 1;
            }, eve.nt = function(subname) {
                return subname ? new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(current_event) : current_event;
            }, eve.nts = function() {
                return current_event.split(separator);
            }, eve.off = eve.unbind = function(name, f) {
                if (!name) return void (eve._events = events = {
                    n: {}
                });
                var names = name.split(comaseparator);
                if (names.length > 1) for (var i = 0, ii = names.length; i < ii; i++) eve.off(names[i], f); else {
                    names = name.split(separator);
                    var e, key, splice, i, ii, j, jj, cur = [ events ];
                    for (i = 0, ii = names.length; i < ii; i++) for (j = 0; j < cur.length; j += splice.length - 2) {
                        if (splice = [ j, 1 ], e = cur[j].n, names[i] != wildcard) e[names[i]] && splice.push(e[names[i]]); else for (key in e) e[has](key) && splice.push(e[key]);
                        cur.splice.apply(cur, splice);
                    }
                    for (i = 0, ii = cur.length; i < ii; i++) for (e = cur[i]; e.n; ) {
                        if (f) {
                            if (e.f) {
                                for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                                    e.f.splice(j, 1);
                                    break;
                                }
                                !e.f.length && delete e.f;
                            }
                            for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                                var funcs = e.n[key].f;
                                for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                                    funcs.splice(j, 1);
                                    break;
                                }
                                !funcs.length && delete e.n[key].f;
                            }
                        } else {
                            delete e.f;
                            for (key in e.n) e.n[has](key) && e.n[key].f && delete e.n[key].f;
                        }
                        e = e.n;
                    }
                }
            }, eve.once = function(name, f) {
                var f2 = function f2() {
                    return eve.unbind(name, f2), f.apply(this, arguments);
                };
                return eve.on(name, f2);
            }, eve.version = version, eve.toString = function() {
                return "You are running Eve " + version;
            }, "undefined" != typeof module && module.exports ? module.exports = eve : "function" == typeof define && define.amd ? define("eve", [], function() {
                return eve;
            }) : glob.eve = eve;
        }(this);
    }, {} ],
    7: [ function(require, module, exports) {
        !function() {
            var cache = {}, ctx = null, usingWebAudio = !0, noAudio = !1;
            try {
                "undefined" != typeof AudioContext ? ctx = new AudioContext() : "undefined" != typeof webkitAudioContext ? ctx = new webkitAudioContext() : usingWebAudio = !1;
            } catch (e) {
                usingWebAudio = !1;
            }
            if (!usingWebAudio) if ("undefined" != typeof Audio) try {
                new Audio();
            } catch (e) {
                noAudio = !0;
            } else noAudio = !0;
            if (usingWebAudio) {
                var masterGain = "undefined" == typeof ctx.createGain ? ctx.createGainNode() : ctx.createGain();
                masterGain.gain.value = 1, masterGain.connect(ctx.destination);
            }
            var HowlerGlobal = function(codecs) {
                this._volume = 1, this._muted = !1, this.usingWebAudio = usingWebAudio, this.ctx = ctx, 
                this.noAudio = noAudio, this._howls = [], this._codecs = codecs, this.iOSAutoEnable = !0;
            };
            HowlerGlobal.prototype = {
                volume: function(vol) {
                    var self = this;
                    if (vol = parseFloat(vol), vol >= 0 && vol <= 1) {
                        self._volume = vol, usingWebAudio && (masterGain.gain.value = vol);
                        for (var key in self._howls) if (self._howls.hasOwnProperty(key) && self._howls[key]._webAudio === !1) for (var i = 0; i < self._howls[key]._audioNode.length; i++) self._howls[key]._audioNode[i].volume = self._howls[key]._volume * self._volume;
                        return self;
                    }
                    return usingWebAudio ? masterGain.gain.value : self._volume;
                },
                mute: function() {
                    return this._setMuted(!0), this;
                },
                unmute: function() {
                    return this._setMuted(!1), this;
                },
                _setMuted: function(muted) {
                    var self = this;
                    self._muted = muted, usingWebAudio && (masterGain.gain.value = muted ? 0 : self._volume);
                    for (var key in self._howls) if (self._howls.hasOwnProperty(key) && self._howls[key]._webAudio === !1) for (var i = 0; i < self._howls[key]._audioNode.length; i++) self._howls[key]._audioNode[i].muted = muted;
                },
                codecs: function(ext) {
                    return this._codecs[ext];
                },
                _enableiOSAudio: function() {
                    var self = this;
                    if (!ctx || !self._iOSEnabled && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                        self._iOSEnabled = !1;
                        var unlock = function unlock() {
                            var buffer = ctx.createBuffer(1, 1, 22050), source = ctx.createBufferSource();
                            source.buffer = buffer, source.connect(ctx.destination), "undefined" == typeof source.start ? source.noteOn(0) : source.start(0), 
                            setTimeout(function() {
                                source.playbackState !== source.PLAYING_STATE && source.playbackState !== source.FINISHED_STATE || (self._iOSEnabled = !0, 
                                self.iOSAutoEnable = !1, window.removeEventListener("touchend", unlock, !1));
                            }, 0);
                        };
                        return window.addEventListener("touchend", unlock, !1), self;
                    }
                }
            };
            var audioTest = null, codecs = {};
            noAudio || (audioTest = new Audio(), codecs = {
                mp3: !!audioTest.canPlayType("audio/mpeg;").replace(/^no$/, ""),
                opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
                aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
                m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
                mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
                weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
            });
            var Howler = new HowlerGlobal(codecs), Howl = function(o) {
                var self = this;
                self._autoplay = o.autoplay || !1, self._buffer = o.buffer || !1, self._duration = o.duration || 0, 
                self._format = o.format || null, self._loop = o.loop || !1, self._loaded = !1, self._sprite = o.sprite || {}, 
                self._src = o.src || "", self._pos3d = o.pos3d || [ 0, 0, -.5 ], self._volume = void 0 !== o.volume ? o.volume : 1, 
                self._urls = o.urls || [], self._rate = o.rate || 1, self._model = o.model || null, 
                self._onload = [ o.onload || function() {} ], self._onloaderror = [ o.onloaderror || function() {} ], 
                self._onend = [ o.onend || function() {} ], self._onpause = [ o.onpause || function() {} ], 
                self._onplay = [ o.onplay || function() {} ], self._onendTimer = [], self._webAudio = usingWebAudio && !self._buffer, 
                self._audioNode = [], self._webAudio && self._setupAudioNode(), "undefined" != typeof ctx && ctx && Howler.iOSAutoEnable && Howler._enableiOSAudio(), 
                Howler._howls.push(self), self.load();
            };
            if (Howl.prototype = {
                load: function() {
                    var self = this, url = null;
                    if (noAudio) return void self.on("loaderror", new Error("No audio support."));
                    for (var i = 0; i < self._urls.length; i++) {
                        var ext, urlItem;
                        if (self._format) ext = self._format; else {
                            if (urlItem = self._urls[i], ext = /^data:audio\/([^;,]+);/i.exec(urlItem), ext || (ext = /\.([^.]+)$/.exec(urlItem.split("?", 1)[0])), 
                            !ext) return void self.on("loaderror", new Error("Could not extract format from passed URLs, please add format parameter."));
                            ext = ext[1].toLowerCase();
                        }
                        if (codecs[ext]) {
                            url = self._urls[i];
                            break;
                        }
                    }
                    if (!url) return void self.on("loaderror", new Error("No codec support for selected audio sources."));
                    if (self._src = url, self._webAudio) loadBuffer(self, url); else {
                        var newNode = new Audio();
                        newNode.addEventListener("error", function() {
                            newNode.error && 4 === newNode.error.code && (HowlerGlobal.noAudio = !0), self.on("loaderror", {
                                type: newNode.error ? newNode.error.code : 0
                            });
                        }, !1), self._audioNode.push(newNode), newNode.src = url, newNode._pos = 0, newNode.preload = "auto", 
                        newNode.volume = Howler._muted ? 0 : self._volume * Howler.volume();
                        var listener = function listener() {
                            self._duration = Math.ceil(10 * newNode.duration) / 10, 0 === Object.getOwnPropertyNames(self._sprite).length && (self._sprite = {
                                _default: [ 0, 1e3 * self._duration ]
                            }), self._loaded || (self._loaded = !0, self.on("load")), self._autoplay && self.play(), 
                            newNode.removeEventListener("canplaythrough", listener, !1);
                        };
                        newNode.addEventListener("canplaythrough", listener, !1), newNode.load();
                    }
                    return self;
                },
                urls: function(_urls) {
                    var self = this;
                    return _urls ? (self.stop(), self._urls = "string" == typeof _urls ? [ _urls ] : _urls, 
                    self._loaded = !1, self.load(), self) : self._urls;
                },
                play: function(sprite, callback) {
                    var self = this;
                    return "function" == typeof sprite && (callback = sprite), sprite && "function" != typeof sprite || (sprite = "_default"), 
                    self._loaded ? self._sprite[sprite] ? (self._inactiveNode(function(node) {
                        node._sprite = sprite;
                        var pos = node._pos > 0 ? node._pos : self._sprite[sprite][0] / 1e3, duration = 0;
                        self._webAudio ? (duration = self._sprite[sprite][1] / 1e3 - node._pos, node._pos > 0 && (pos = self._sprite[sprite][0] / 1e3 + pos)) : duration = self._sprite[sprite][1] / 1e3 - (pos - self._sprite[sprite][0] / 1e3);
                        var timerId, loop = !(!self._loop && !self._sprite[sprite][2]), soundId = "string" == typeof callback ? callback : Math.round(Date.now() * Math.random()) + "";
                        if (function() {
                            var data = {
                                id: soundId,
                                sprite: sprite,
                                loop: loop
                            };
                            timerId = setTimeout(function() {
                                !self._webAudio && loop && self.stop(data.id).play(sprite, data.id), self._webAudio && !loop && (self._nodeById(data.id).paused = !0, 
                                self._nodeById(data.id)._pos = 0, self._clearEndTimer(data.id)), self._webAudio || loop || self.stop(data.id), 
                                self.on("end", soundId);
                            }, duration / self._rate * 1e3), self._onendTimer.push({
                                timer: timerId,
                                id: data.id
                            });
                        }(), self._webAudio) {
                            var loopStart = self._sprite[sprite][0] / 1e3, loopEnd = self._sprite[sprite][1] / 1e3;
                            node.id = soundId, node.paused = !1, refreshBuffer(self, [ loop, loopStart, loopEnd ], soundId), 
                            self._playStart = ctx.currentTime, node.gain.value = self._volume, "undefined" == typeof node.bufferSource.start ? loop ? node.bufferSource.noteGrainOn(0, pos, 86400) : node.bufferSource.noteGrainOn(0, pos, duration) : loop ? node.bufferSource.start(0, pos, 86400) : node.bufferSource.start(0, pos, duration);
                        } else {
                            if (4 !== node.readyState && (node.readyState || !navigator.isCocoonJS)) return self._clearEndTimer(soundId), 
                            function() {
                                var sound = self, playSprite = sprite, fn = callback, newNode = node, listener = function listener() {
                                    sound.play(playSprite, fn), newNode.removeEventListener("canplaythrough", listener, !1);
                                };
                                newNode.addEventListener("canplaythrough", listener, !1);
                            }(), self;
                            node.readyState = 4, node.id = soundId, node.currentTime = pos, node.muted = Howler._muted || node.muted, 
                            node.volume = self._volume * Howler.volume(), setTimeout(function() {
                                node.play();
                            }, 0);
                        }
                        return self.on("play"), "function" == typeof callback && callback(soundId), self;
                    }), self) : ("function" == typeof callback && callback(), self) : (self.on("load", function() {
                        self.play(sprite, callback);
                    }), self);
                },
                pause: function(id) {
                    var self = this;
                    if (!self._loaded) return self.on("play", function() {
                        self.pause(id);
                    }), self;
                    self._clearEndTimer(id);
                    var activeNode = id ? self._nodeById(id) : self._activeNode();
                    if (activeNode) if (activeNode._pos = self.pos(null, id), self._webAudio) {
                        if (!activeNode.bufferSource || activeNode.paused) return self;
                        activeNode.paused = !0, "undefined" == typeof activeNode.bufferSource.stop ? activeNode.bufferSource.noteOff(0) : activeNode.bufferSource.stop(0);
                    } else activeNode.pause();
                    return self.on("pause"), self;
                },
                stop: function(id) {
                    var self = this;
                    if (!self._loaded) return self.on("play", function() {
                        self.stop(id);
                    }), self;
                    self._clearEndTimer(id);
                    var activeNode = id ? self._nodeById(id) : self._activeNode();
                    if (activeNode) if (activeNode._pos = 0, self._webAudio) {
                        if (!activeNode.bufferSource || activeNode.paused) return self;
                        activeNode.paused = !0, "undefined" == typeof activeNode.bufferSource.stop ? activeNode.bufferSource.noteOff(0) : activeNode.bufferSource.stop(0);
                    } else isNaN(activeNode.duration) || (activeNode.pause(), activeNode.currentTime = 0);
                    return self;
                },
                mute: function(id) {
                    var self = this;
                    if (!self._loaded) return self.on("play", function() {
                        self.mute(id);
                    }), self;
                    var activeNode = id ? self._nodeById(id) : self._activeNode();
                    return activeNode && (self._webAudio ? activeNode.gain.value = 0 : activeNode.muted = !0), 
                    self;
                },
                unmute: function(id) {
                    var self = this;
                    if (!self._loaded) return self.on("play", function() {
                        self.unmute(id);
                    }), self;
                    var activeNode = id ? self._nodeById(id) : self._activeNode();
                    return activeNode && (self._webAudio ? activeNode.gain.value = self._volume : activeNode.muted = !1), 
                    self;
                },
                volume: function(vol, id) {
                    var self = this;
                    if (vol = parseFloat(vol), vol >= 0 && vol <= 1) {
                        if (self._volume = vol, !self._loaded) return self.on("play", function() {
                            self.volume(vol, id);
                        }), self;
                        var activeNode = id ? self._nodeById(id) : self._activeNode();
                        return activeNode && (self._webAudio ? activeNode.gain.value = vol : activeNode.volume = vol * Howler.volume()), 
                        self;
                    }
                    return self._volume;
                },
                loop: function(_loop) {
                    var self = this;
                    return "boolean" == typeof _loop ? (self._loop = _loop, self) : self._loop;
                },
                sprite: function(_sprite) {
                    var self = this;
                    return "object" === ("undefined" == typeof _sprite ? "undefined" : _typeof(_sprite)) ? (self._sprite = _sprite, 
                    self) : self._sprite;
                },
                pos: function(_pos, id) {
                    var self = this;
                    if (!self._loaded) return self.on("load", function() {
                        self.pos(_pos);
                    }), "number" == typeof _pos ? self : self._pos || 0;
                    _pos = parseFloat(_pos);
                    var activeNode = id ? self._nodeById(id) : self._activeNode();
                    if (activeNode) return _pos >= 0 ? (self.pause(id), activeNode._pos = _pos, self.play(activeNode._sprite, id), 
                    self) : self._webAudio ? activeNode._pos + (ctx.currentTime - self._playStart) : activeNode.currentTime;
                    if (_pos >= 0) return self;
                    for (var i = 0; i < self._audioNode.length; i++) if (self._audioNode[i].paused && 4 === self._audioNode[i].readyState) return self._webAudio ? self._audioNode[i]._pos : self._audioNode[i].currentTime;
                },
                pos3d: function(x, y, z, id) {
                    var self = this;
                    if (y = "undefined" != typeof y && y ? y : 0, z = "undefined" != typeof z && z ? z : -.5, 
                    !self._loaded) return self.on("play", function() {
                        self.pos3d(x, y, z, id);
                    }), self;
                    if (!(x >= 0 || x < 0)) return self._pos3d;
                    if (self._webAudio) {
                        var activeNode = id ? self._nodeById(id) : self._activeNode();
                        activeNode && (self._pos3d = [ x, y, z ], activeNode.panner.setPosition(x, y, z), 
                        activeNode.panner.panningModel = self._model || "HRTF");
                    }
                    return self;
                },
                fade: function(from, to, len, callback, id) {
                    var self = this, diff = Math.abs(from - to), dir = from > to ? "down" : "up", steps = diff / .01, stepTime = len / steps;
                    if (!self._loaded) return self.on("load", function() {
                        self.fade(from, to, len, callback, id);
                    }), self;
                    self.volume(from, id);
                    for (var i = 1; i <= steps; i++) !function() {
                        var change = self._volume + ("up" === dir ? .01 : -.01) * i, vol = Math.round(1e3 * change) / 1e3, toVol = to;
                        setTimeout(function() {
                            self.volume(vol, id), vol === toVol && callback && callback();
                        }, stepTime * i);
                    }();
                },
                fadeIn: function(to, len, callback) {
                    return this.volume(0).play().fade(0, to, len, callback);
                },
                fadeOut: function(to, len, callback, id) {
                    var self = this;
                    return self.fade(self._volume, to, len, function() {
                        callback && callback(), self.pause(id), self.on("end");
                    }, id);
                },
                _nodeById: function(id) {
                    for (var self = this, node = self._audioNode[0], i = 0; i < self._audioNode.length; i++) if (self._audioNode[i].id === id) {
                        node = self._audioNode[i];
                        break;
                    }
                    return node;
                },
                _activeNode: function() {
                    for (var self = this, node = null, i = 0; i < self._audioNode.length; i++) if (!self._audioNode[i].paused) {
                        node = self._audioNode[i];
                        break;
                    }
                    return self._drainPool(), node;
                },
                _inactiveNode: function(callback) {
                    for (var self = this, node = null, i = 0; i < self._audioNode.length; i++) if (self._audioNode[i].paused && 4 === self._audioNode[i].readyState) {
                        callback(self._audioNode[i]), node = !0;
                        break;
                    }
                    if (self._drainPool(), !node) {
                        var newNode;
                        if (self._webAudio) newNode = self._setupAudioNode(), callback(newNode); else {
                            self.load(), newNode = self._audioNode[self._audioNode.length - 1];
                            var listenerEvent = navigator.isCocoonJS ? "canplaythrough" : "loadedmetadata", listener = function listener() {
                                newNode.removeEventListener(listenerEvent, listener, !1), callback(newNode);
                            };
                            newNode.addEventListener(listenerEvent, listener, !1);
                        }
                    }
                },
                _drainPool: function() {
                    var i, self = this, inactive = 0;
                    for (i = 0; i < self._audioNode.length; i++) self._audioNode[i].paused && inactive++;
                    for (i = self._audioNode.length - 1; i >= 0 && !(inactive <= 5); i--) self._audioNode[i].paused && (self._webAudio && self._audioNode[i].disconnect(0), 
                    inactive--, self._audioNode.splice(i, 1));
                },
                _clearEndTimer: function(soundId) {
                    for (var self = this, index = -1, i = 0; i < self._onendTimer.length; i++) if (self._onendTimer[i].id === soundId) {
                        index = i;
                        break;
                    }
                    var timer = self._onendTimer[index];
                    timer && (clearTimeout(timer.timer), self._onendTimer.splice(index, 1));
                },
                _setupAudioNode: function() {
                    var self = this, node = self._audioNode, index = self._audioNode.length;
                    return node[index] = "undefined" == typeof ctx.createGain ? ctx.createGainNode() : ctx.createGain(), 
                    node[index].gain.value = self._volume, node[index].paused = !0, node[index]._pos = 0, 
                    node[index].readyState = 4, node[index].connect(masterGain), node[index].panner = ctx.createPanner(), 
                    node[index].panner.panningModel = self._model || "equalpower", node[index].panner.setPosition(self._pos3d[0], self._pos3d[1], self._pos3d[2]), 
                    node[index].panner.connect(node[index]), node[index];
                },
                on: function(event, fn) {
                    var self = this, events = self["_on" + event];
                    if ("function" == typeof fn) events.push(fn); else for (var i = 0; i < events.length; i++) fn ? events[i].call(self, fn) : events[i].call(self);
                    return self;
                },
                off: function(event, fn) {
                    var self = this, events = self["_on" + event];
                    if (fn) {
                        for (var i = 0; i < events.length; i++) if (fn === events[i]) {
                            events.splice(i, 1);
                            break;
                        }
                    } else self["_on" + event] = [];
                    return self;
                },
                unload: function() {
                    for (var self = this, nodes = self._audioNode, i = 0; i < self._audioNode.length; i++) nodes[i].paused || (self.stop(nodes[i].id), 
                    self.on("end", nodes[i].id)), self._webAudio ? nodes[i].disconnect(0) : nodes[i].src = "";
                    for (i = 0; i < self._onendTimer.length; i++) clearTimeout(self._onendTimer[i].timer);
                    var index = Howler._howls.indexOf(self);
                    null !== index && index >= 0 && Howler._howls.splice(index, 1), delete cache[self._src], 
                    self = null;
                }
            }, usingWebAudio) var loadBuffer = function(obj, url) {
                if (url in cache) return obj._duration = cache[url].duration, void loadSound(obj);
                if (/^data:[^;]+;base64,/.test(url)) {
                    for (var data = atob(url.split(",")[1]), dataView = new Uint8Array(data.length), i = 0; i < data.length; ++i) dataView[i] = data.charCodeAt(i);
                    decodeAudioData(dataView.buffer, obj, url);
                } else {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, !0), xhr.responseType = "arraybuffer", xhr.onload = function() {
                        decodeAudioData(xhr.response, obj, url);
                    }, xhr.onerror = function() {
                        obj._webAudio && (obj._buffer = !0, obj._webAudio = !1, obj._audioNode = [], delete obj._gainNode, 
                        delete cache[url], obj.load());
                    };
                    try {
                        xhr.send();
                    } catch (e) {
                        xhr.onerror();
                    }
                }
            }, decodeAudioData = function(arraybuffer, obj, url) {
                ctx.decodeAudioData(arraybuffer, function(buffer) {
                    buffer && (cache[url] = buffer, loadSound(obj, buffer));
                }, function(err) {
                    obj.on("loaderror", err);
                });
            }, loadSound = function(obj, buffer) {
                obj._duration = buffer ? buffer.duration : obj._duration, 0 === Object.getOwnPropertyNames(obj._sprite).length && (obj._sprite = {
                    _default: [ 0, 1e3 * obj._duration ]
                }), obj._loaded || (obj._loaded = !0, obj.on("load")), obj._autoplay && obj.play();
            }, refreshBuffer = function(obj, loop, id) {
                var node = obj._nodeById(id);
                node.bufferSource = ctx.createBufferSource(), node.bufferSource.buffer = cache[obj._src], 
                node.bufferSource.connect(node.panner), node.bufferSource.loop = loop[0], loop[0] && (node.bufferSource.loopStart = loop[1], 
                node.bufferSource.loopEnd = loop[1] + loop[2]), node.bufferSource.playbackRate.value = obj._rate;
            };
            "function" == typeof define && define.amd && define(function() {
                return {
                    Howler: Howler,
                    Howl: Howl
                };
            }), "undefined" != typeof exports && (exports.Howler = Howler, exports.Howl = Howl), 
            "undefined" != typeof window && (window.Howler = Howler, window.Howl = Howl);
        }();
    }, {} ],
    8: [ function(require, module, exports) {
        function cleanUpNextTick() {
            draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
            queue.length && drainQueue());
        }
        function drainQueue() {
            if (!draining) {
                var timeout = cachedSetTimeout(cleanUpNextTick);
                draining = !0;
                for (var len = queue.length; len; ) {
                    for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                    queueIndex = -1, len = queue.length;
                }
                currentQueue = null, draining = !1, cachedClearTimeout(timeout);
            }
        }
        function Item(fun, array) {
            this.fun = fun, this.array = array;
        }
        function noop() {}
        var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
        !function() {
            try {
                cachedSetTimeout = setTimeout;
            } catch (e) {
                cachedSetTimeout = function() {
                    throw new Error("setTimeout is not defined");
                };
            }
            try {
                cachedClearTimeout = clearTimeout;
            } catch (e) {
                cachedClearTimeout = function() {
                    throw new Error("clearTimeout is not defined");
                };
            }
        }();
        var currentQueue, queue = [], draining = !1, queueIndex = -1;
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args)), 1 !== queue.length || draining || cachedSetTimeout(drainQueue, 0);
        }, Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
        process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
        process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
        process.emit = noop, process.binding = function(name) {
            throw new Error("process.binding is not supported");
        }, process.cwd = function() {
            return "/";
        }, process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        }, process.umask = function() {
            return 0;
        };
    }, {} ],
    9: [ function(require, module, exports) {
        !function(glob) {
            var current_event, stop, version = "0.4.2", has = "hasOwnProperty", separator = /[\.\/]/, comaseparator = /\s*,\s*/, wildcard = "*", numsort = function(a, b) {
                return a - b;
            }, events = {
                n: {}
            }, firstDefined = function() {
                for (var i = 0, ii = this.length; i < ii; i++) if ("undefined" != typeof this[i]) return this[i];
            }, lastDefined = function() {
                for (var i = this.length; --i; ) if ("undefined" != typeof this[i]) return this[i];
            }, eve = function eve(name, scope) {
                name = String(name);
                var l, oldstop = stop, args = Array.prototype.slice.call(arguments, 2), listeners = eve.listeners(name), z = 0, indexed = [], queue = {}, out = [], ce = current_event;
                out.firstDefined = firstDefined, out.lastDefined = lastDefined, current_event = name, 
                stop = 0;
                for (var i = 0, ii = listeners.length; i < ii; i++) "zIndex" in listeners[i] && (indexed.push(listeners[i].zIndex), 
                listeners[i].zIndex < 0 && (queue[listeners[i].zIndex] = listeners[i]));
                for (indexed.sort(numsort); indexed[z] < 0; ) if (l = queue[indexed[z++]], out.push(l.apply(scope, args)), 
                stop) return stop = oldstop, out;
                for (i = 0; i < ii; i++) if (l = listeners[i], "zIndex" in l) if (l.zIndex == indexed[z]) {
                    if (out.push(l.apply(scope, args)), stop) break;
                    do if (z++, l = queue[indexed[z]], l && out.push(l.apply(scope, args)), stop) break; while (l);
                } else queue[l.zIndex] = l; else if (out.push(l.apply(scope, args)), stop) break;
                return stop = oldstop, current_event = ce, out;
            };
            eve._events = events, eve.listeners = function(name) {
                var item, items, k, i, ii, j, jj, nes, names = name.split(separator), e = events, es = [ e ], out = [];
                for (i = 0, ii = names.length; i < ii; i++) {
                    for (nes = [], j = 0, jj = es.length; j < jj; j++) for (e = es[j].n, items = [ e[names[i]], e[wildcard] ], 
                    k = 2; k--; ) item = items[k], item && (nes.push(item), out = out.concat(item.f || []));
                    es = nes;
                }
                return out;
            }, eve.on = function(name, f) {
                if (name = String(name), "function" != typeof f) return function() {};
                for (var names = name.split(comaseparator), i = 0, ii = names.length; i < ii; i++) !function(name) {
                    for (var exist, names = name.split(separator), e = events, i = 0, ii = names.length; i < ii; i++) e = e.n, 
                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {
                        n: {}
                    });
                    for (e.f = e.f || [], i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                        exist = !0;
                        break;
                    }
                    !exist && e.f.push(f);
                }(names[i]);
                return function(zIndex) {
                    +zIndex == +zIndex && (f.zIndex = +zIndex);
                };
            }, eve.f = function(event) {
                var attrs = [].slice.call(arguments, 1);
                return function() {
                    eve.apply(null, [ event, null ].concat(attrs).concat([].slice.call(arguments, 0)));
                };
            }, eve.stop = function() {
                stop = 1;
            }, eve.nt = function(subname) {
                return subname ? new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(current_event) : current_event;
            }, eve.nts = function() {
                return current_event.split(separator);
            }, eve.off = eve.unbind = function(name, f) {
                if (!name) return void (eve._events = events = {
                    n: {}
                });
                var names = name.split(comaseparator);
                if (names.length > 1) for (var i = 0, ii = names.length; i < ii; i++) eve.off(names[i], f); else {
                    names = name.split(separator);
                    var e, key, splice, i, ii, j, jj, cur = [ events ];
                    for (i = 0, ii = names.length; i < ii; i++) for (j = 0; j < cur.length; j += splice.length - 2) {
                        if (splice = [ j, 1 ], e = cur[j].n, names[i] != wildcard) e[names[i]] && splice.push(e[names[i]]); else for (key in e) e[has](key) && splice.push(e[key]);
                        cur.splice.apply(cur, splice);
                    }
                    for (i = 0, ii = cur.length; i < ii; i++) for (e = cur[i]; e.n; ) {
                        if (f) {
                            if (e.f) {
                                for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                                    e.f.splice(j, 1);
                                    break;
                                }
                                !e.f.length && delete e.f;
                            }
                            for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                                var funcs = e.n[key].f;
                                for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                                    funcs.splice(j, 1);
                                    break;
                                }
                                !funcs.length && delete e.n[key].f;
                            }
                        } else {
                            delete e.f;
                            for (key in e.n) e.n[has](key) && e.n[key].f && delete e.n[key].f;
                        }
                        e = e.n;
                    }
                }
            }, eve.once = function(name, f) {
                var f2 = function f2() {
                    return eve.unbind(name, f2), f.apply(this, arguments);
                };
                return eve.on(name, f2);
            }, eve.version = version, eve.toString = function() {
                return "You are running Eve " + version;
            }, "undefined" != typeof module && module.exports ? module.exports = eve : "function" == typeof define && define.amd ? define("eve", [], function() {
                return eve;
            }) : glob.eve = eve;
        }(this), function(glob, factory) {
            if ("function" == typeof define && define.amd) define([ "eve" ], function(eve) {
                return factory(glob, eve);
            }); else if ("undefined" != typeof exports) {
                var eve = require("eve");
                module.exports = factory(glob, eve);
            } else factory(glob, glob.eve);
        }(window || this, function(window, eve) {
            var mina = function(eve) {
                var animations = {}, requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                    setTimeout(callback, 16);
                }, isArray = Array.isArray || function(a) {
                    return a instanceof Array || "[object Array]" == Object.prototype.toString.call(a);
                }, idgen = 0, idprefix = "M" + (+new Date()).toString(36), ID = function() {
                    return idprefix + (idgen++).toString(36);
                }, timer = Date.now || function() {
                    return +new Date();
                }, sta = function(val) {
                    var a = this;
                    if (null == val) return a.s;
                    var ds = a.s - val;
                    a.b += a.dur * ds, a.B += a.dur * ds, a.s = val;
                }, speed = function(val) {
                    var a = this;
                    return null == val ? a.spd : void (a.spd = val);
                }, duration = function(val) {
                    var a = this;
                    return null == val ? a.dur : (a.s = a.s * val / a.dur, void (a.dur = val));
                }, stopit = function() {
                    var a = this;
                    delete animations[a.id], a.update(), eve("mina.stop." + a.id, a);
                }, pause = function() {
                    var a = this;
                    a.pdif || (delete animations[a.id], a.update(), a.pdif = a.get() - a.b);
                }, resume = function() {
                    var a = this;
                    a.pdif && (a.b = a.get() - a.pdif, delete a.pdif, animations[a.id] = a);
                }, update = function() {
                    var res, a = this;
                    if (isArray(a.start)) {
                        res = [];
                        for (var j = 0, jj = a.start.length; j < jj; j++) res[j] = +a.start[j] + (a.end[j] - a.start[j]) * a.easing(a.s);
                    } else res = +a.start + (a.end - a.start) * a.easing(a.s);
                    a.set(res);
                }, frame = function frame() {
                    var len = 0;
                    for (var i in animations) if (animations.hasOwnProperty(i)) {
                        var a = animations[i], b = a.get();
                        len++, a.s = (b - a.b) / (a.dur / a.spd), a.s >= 1 && (delete animations[i], a.s = 1, 
                        len--, function(a) {
                            setTimeout(function() {
                                eve("mina.finish." + a.id, a);
                            });
                        }(a)), a.update();
                    }
                    len && requestAnimFrame(frame);
                }, mina = function mina(a, A, b, B, get, set, easing) {
                    var anim = {
                        id: ID(),
                        start: a,
                        end: A,
                        b: b,
                        s: 0,
                        dur: B - b,
                        spd: 1,
                        get: get,
                        set: set,
                        easing: easing || mina.linear,
                        status: sta,
                        speed: speed,
                        duration: duration,
                        stop: stopit,
                        pause: pause,
                        resume: resume,
                        update: update
                    };
                    animations[anim.id] = anim;
                    var i, len = 0;
                    for (i in animations) if (animations.hasOwnProperty(i) && (len++, 2 == len)) break;
                    return 1 == len && requestAnimFrame(frame), anim;
                };
                return mina.time = timer, mina.getById = function(id) {
                    return animations[id] || null;
                }, mina.linear = function(n) {
                    return n;
                }, mina.easeout = function(n) {
                    return Math.pow(n, 1.7);
                }, mina.easein = function(n) {
                    return Math.pow(n, .48);
                }, mina.easeinout = function(n) {
                    if (1 == n) return 1;
                    if (0 == n) return 0;
                    var q = .48 - n / 1.04, Q = Math.sqrt(.1734 + q * q), x = Q - q, X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1), y = -Q - q, Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1), t = X + Y + .5;
                    return 3 * (1 - t) * t * t + t * t * t;
                }, mina.backin = function(n) {
                    if (1 == n) return 1;
                    var s = 1.70158;
                    return n * n * ((s + 1) * n - s);
                }, mina.backout = function(n) {
                    if (0 == n) return 0;
                    n -= 1;
                    var s = 1.70158;
                    return n * n * ((s + 1) * n + s) + 1;
                }, mina.elastic = function(n) {
                    return n == !!n ? n : Math.pow(2, -10 * n) * Math.sin((n - .075) * (2 * Math.PI) / .3) + 1;
                }, mina.bounce = function(n) {
                    var l, s = 7.5625, p = 2.75;
                    return n < 1 / p ? l = s * n * n : n < 2 / p ? (n -= 1.5 / p, l = s * n * n + .75) : n < 2.5 / p ? (n -= 2.25 / p, 
                    l = s * n * n + .9375) : (n -= 2.625 / p, l = s * n * n + .984375), l;
                }, window.mina = mina, mina;
            }("undefined" == typeof eve ? function() {} : eve), Snap = function(root) {
                function Snap(w, h) {
                    if (w) {
                        if (w.nodeType) return wrap(w);
                        if (is(w, "array") && Snap.set) return Snap.set.apply(Snap, w);
                        if (w instanceof Element) return w;
                        if (null == h) return w = glob.doc.querySelector(String(w)), wrap(w);
                    }
                    return w = null == w ? "100%" : w, h = null == h ? "100%" : h, new Paper(w, h);
                }
                function $(el, attr) {
                    if (attr) {
                        if ("#text" == el && (el = glob.doc.createTextNode(attr.text || attr["#text"] || "")), 
                        "#comment" == el && (el = glob.doc.createComment(attr.text || attr["#text"] || "")), 
                        "string" == typeof el && (el = $(el)), "string" == typeof attr) return 1 == el.nodeType ? "xlink:" == attr.substring(0, 6) ? el.getAttributeNS(xlink, attr.substring(6)) : "xml:" == attr.substring(0, 4) ? el.getAttributeNS(xmlns, attr.substring(4)) : el.getAttribute(attr) : "text" == attr ? el.nodeValue : null;
                        if (1 == el.nodeType) {
                            for (var key in attr) if (attr[has](key)) {
                                var val = Str(attr[key]);
                                val ? "xlink:" == key.substring(0, 6) ? el.setAttributeNS(xlink, key.substring(6), val) : "xml:" == key.substring(0, 4) ? el.setAttributeNS(xmlns, key.substring(4), val) : el.setAttribute(key, val) : el.removeAttribute(key);
                            }
                        } else "text" in attr && (el.nodeValue = attr.text);
                    } else el = glob.doc.createElementNS(xmlns, el);
                    return el;
                }
                function is(o, type) {
                    return type = Str.prototype.toLowerCase.call(type), "finite" == type ? isFinite(o) : !("array" != type || !(o instanceof Array || Array.isArray && Array.isArray(o))) || ("null" == type && null === o || type == ("undefined" == typeof o ? "undefined" : _typeof(o)) && null !== o || "object" == type && o === Object(o) || objectToString.call(o).slice(8, -1).toLowerCase() == type);
                }
                function clone(obj) {
                    if ("function" == typeof obj || Object(obj) !== obj) return obj;
                    var res = new obj.constructor();
                    for (var key in obj) obj[has](key) && (res[key] = clone(obj[key]));
                    return res;
                }
                function repush(array, item) {
                    for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) return array.push(array.splice(i, 1)[0]);
                }
                function cacher(f, scope, postprocessor) {
                    function newf() {
                        var arg = Array.prototype.slice.call(arguments, 0), args = arg.join("␀"), cache = newf.cache = newf.cache || {}, count = newf.count = newf.count || [];
                        return cache[has](args) ? (repush(count, args), postprocessor ? postprocessor(cache[args]) : cache[args]) : (count.length >= 1e3 && delete cache[count.shift()], 
                        count.push(args), cache[args] = f.apply(scope, arg), postprocessor ? postprocessor(cache[args]) : cache[args]);
                    }
                    return newf;
                }
                function angle(x1, y1, x2, y2, x3, y3) {
                    if (null == x3) {
                        var x = x1 - x2, y = y1 - y2;
                        return x || y ? (180 + 180 * math.atan2(-y, -x) / PI + 360) % 360 : 0;
                    }
                    return angle(x1, y1, x3, y3) - angle(x2, y2, x3, y3);
                }
                function rad(deg) {
                    return deg % 360 * PI / 180;
                }
                function deg(rad) {
                    return 180 * rad / PI % 360;
                }
                function svgTransform2string(tstr) {
                    var res = [];
                    return tstr = tstr.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function(all, name, params) {
                        return params = params.split(/\s*,\s*|\s+/), "rotate" == name && 1 == params.length && params.push(0, 0), 
                        "scale" == name && (params.length > 2 ? params = params.slice(0, 2) : 2 == params.length && params.push(0, 0), 
                        1 == params.length && params.push(params[0], 0, 0)), "skewX" == name ? res.push([ "m", 1, 0, math.tan(rad(params[0])), 1, 0, 0 ]) : "skewY" == name ? res.push([ "m", 1, math.tan(rad(params[0])), 0, 1, 0, 0 ]) : res.push([ name.charAt(0) ].concat(params)), 
                        all;
                    }), res;
                }
                function transform2matrix(tstr, bbox) {
                    var tdata = parseTransformString(tstr), m = new Snap.Matrix();
                    if (tdata) for (var i = 0, ii = tdata.length; i < ii; i++) {
                        var x1, y1, x2, y2, bb, t = tdata[i], tlen = t.length, command = Str(t[0]).toLowerCase(), absolute = t[0] != command, inver = absolute ? m.invert() : 0;
                        "t" == command && 2 == tlen ? m.translate(t[1], 0) : "t" == command && 3 == tlen ? absolute ? (x1 = inver.x(0, 0), 
                        y1 = inver.y(0, 0), x2 = inver.x(t[1], t[2]), y2 = inver.y(t[1], t[2]), m.translate(x2 - x1, y2 - y1)) : m.translate(t[1], t[2]) : "r" == command ? 2 == tlen ? (bb = bb || bbox, 
                        m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2)) : 4 == tlen && (absolute ? (x2 = inver.x(t[2], t[3]), 
                        y2 = inver.y(t[2], t[3]), m.rotate(t[1], x2, y2)) : m.rotate(t[1], t[2], t[3])) : "s" == command ? 2 == tlen || 3 == tlen ? (bb = bb || bbox, 
                        m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2)) : 4 == tlen ? absolute ? (x2 = inver.x(t[2], t[3]), 
                        y2 = inver.y(t[2], t[3]), m.scale(t[1], t[1], x2, y2)) : m.scale(t[1], t[1], t[2], t[3]) : 5 == tlen && (absolute ? (x2 = inver.x(t[3], t[4]), 
                        y2 = inver.y(t[3], t[4]), m.scale(t[1], t[2], x2, y2)) : m.scale(t[1], t[2], t[3], t[4])) : "m" == command && 7 == tlen && m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
                    }
                    return m;
                }
                function getSomeDefs(el) {
                    var p = el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) || el.node.parentNode && wrap(el.node.parentNode) || Snap.select("svg") || Snap(0, 0), pdefs = p.select("defs"), defs = null != pdefs && pdefs.node;
                    return defs || (defs = make("defs", p.node).node), defs;
                }
                function getSomeSVG(el) {
                    return el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) || Snap.select("svg");
                }
                function unit2px(el, name, value) {
                    function getW(val) {
                        if (null == val) return E;
                        if (val == +val) return val;
                        $(mgr, {
                            width: val
                        });
                        try {
                            return mgr.getBBox().width;
                        } catch (e) {
                            return 0;
                        }
                    }
                    function getH(val) {
                        if (null == val) return E;
                        if (val == +val) return val;
                        $(mgr, {
                            height: val
                        });
                        try {
                            return mgr.getBBox().height;
                        } catch (e) {
                            return 0;
                        }
                    }
                    function set(nam, f) {
                        null == name ? out[nam] = f(el.attr(nam) || 0) : nam == name && (out = f(null == value ? el.attr(nam) || 0 : value));
                    }
                    var svg = getSomeSVG(el).node, out = {}, mgr = svg.querySelector(".svg---mgr");
                    switch (mgr || (mgr = $("rect"), $(mgr, {
                        x: -9e9,
                        y: -9e9,
                        width: 10,
                        height: 10,
                        "class": "svg---mgr",
                        fill: "none"
                    }), svg.appendChild(mgr)), el.type) {
                      case "rect":
                        set("rx", getW), set("ry", getH);

                      case "image":
                        set("width", getW), set("height", getH);

                      case "text":
                        set("x", getW), set("y", getH);
                        break;

                      case "circle":
                        set("cx", getW), set("cy", getH), set("r", getW);
                        break;

                      case "ellipse":
                        set("cx", getW), set("cy", getH), set("rx", getW), set("ry", getH);
                        break;

                      case "line":
                        set("x1", getW), set("x2", getW), set("y1", getH), set("y2", getH);
                        break;

                      case "marker":
                        set("refX", getW), set("markerWidth", getW), set("refY", getH), set("markerHeight", getH);
                        break;

                      case "radialGradient":
                        set("fx", getW), set("fy", getH);
                        break;

                      case "tspan":
                        set("dx", getW), set("dy", getH);
                        break;

                      default:
                        set(name, getW);
                    }
                    return svg.removeChild(mgr), out;
                }
                function add2group(list) {
                    is(list, "array") || (list = Array.prototype.slice.call(arguments, 0));
                    for (var i = 0, j = 0, node = this.node; this[i]; ) delete this[i++];
                    for (i = 0; i < list.length; i++) "set" == list[i].type ? list[i].forEach(function(el) {
                        node.appendChild(el.node);
                    }) : node.appendChild(list[i].node);
                    var children = node.childNodes;
                    for (i = 0; i < children.length; i++) this[j++] = wrap(children[i]);
                    return this;
                }
                function Element(el) {
                    if (el.snap in hub) return hub[el.snap];
                    var svg;
                    try {
                        svg = el.ownerSVGElement;
                    } catch (e) {}
                    this.node = el, svg && (this.paper = new Paper(svg)), this.type = el.tagName || el.nodeName;
                    var id = this.id = ID(this);
                    if (this.anims = {}, this._ = {
                        transform: []
                    }, el.snap = id, hub[id] = this, "g" == this.type && (this.add = add2group), this.type in {
                        g: 1,
                        mask: 1,
                        pattern: 1,
                        symbol: 1
                    }) for (var method in Paper.prototype) Paper.prototype[has](method) && (this[method] = Paper.prototype[method]);
                }
                function Fragment(frag) {
                    this.node = frag;
                }
                function make(name, parent) {
                    var res = $(name);
                    parent.appendChild(res);
                    var el = wrap(res);
                    return el;
                }
                function Paper(w, h) {
                    var res, desc, defs, proto = Paper.prototype;
                    if (w && "svg" == w.tagName) {
                        if (w.snap in hub) return hub[w.snap];
                        var doc = w.ownerDocument;
                        res = new Element(w), desc = w.getElementsByTagName("desc")[0], defs = w.getElementsByTagName("defs")[0], 
                        desc || (desc = $("desc"), desc.appendChild(doc.createTextNode("Created with Snap")), 
                        res.node.appendChild(desc)), defs || (defs = $("defs"), res.node.appendChild(defs)), 
                        res.defs = defs;
                        for (var key in proto) proto[has](key) && (res[key] = proto[key]);
                        res.paper = res.root = res;
                    } else res = make("svg", glob.doc.body), $(res.node, {
                        height: h,
                        version: 1.1,
                        width: w,
                        xmlns: xmlns
                    });
                    return res;
                }
                function wrap(dom) {
                    return dom ? dom instanceof Element || dom instanceof Fragment ? dom : dom.tagName && "svg" == dom.tagName.toLowerCase() ? new Paper(dom) : dom.tagName && "object" == dom.tagName.toLowerCase() && "image/svg+xml" == dom.type ? new Paper(dom.contentDocument.getElementsByTagName("svg")[0]) : new Element(dom) : dom;
                }
                function jsonFiller(root, o) {
                    for (var i = 0, ii = root.length; i < ii; i++) {
                        var item = {
                            type: root[i].type,
                            attr: root[i].attr()
                        }, children = root[i].children();
                        o.push(item), children.length && jsonFiller(children, item.childNodes = []);
                    }
                }
                Snap.version = "0.4.0", Snap.toString = function() {
                    return "Snap v" + this.version;
                }, Snap._ = {};
                var glob = {
                    win: root.window,
                    doc: root.window.document
                };
                Snap._.glob = glob;
                var has = "hasOwnProperty", Str = String, toFloat = parseFloat, toInt = parseInt, math = Math, mmax = math.max, mmin = math.min, abs = math.abs, PI = (math.pow, 
                math.PI), E = (math.round, ""), objectToString = Object.prototype.toString, colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i, commaSpaces = (Snap._.separator = /[,\s]+/, 
                /[\s]*,[\s]*/), hsrg = {
                    hs: 1,
                    rg: 1
                }, pathCommand = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi, tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi, pathValues = /(-?\d*\.?\d*(?:e[\-+]?\\d+)?)[\s]*,?[\s]*/gi, idgen = 0, idprefix = "S" + (+new Date()).toString(36), ID = function(el) {
                    return (el && el.type ? el.type : E) + idprefix + (idgen++).toString(36);
                }, xlink = "http://www.w3.org/1999/xlink", xmlns = "http://www.w3.org/2000/svg", hub = {};
                Snap.url = function(url) {
                    return "url('#" + url + "')";
                };
                Snap._.$ = $, Snap._.id = ID, Snap.format = function() {
                    var tokenRegex = /\{([^\}]+)\}/g, objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, replacer = function(all, key, obj) {
                        var res = obj;
                        return key.replace(objNotationRegex, function(all, name, quote, quotedName, isFunc) {
                            name = name || quotedName, res && (name in res && (res = res[name]), "function" == typeof res && isFunc && (res = res()));
                        }), res = (null == res || res == obj ? all : res) + "";
                    };
                    return function(str, obj) {
                        return Str(str).replace(tokenRegex, function(all, key) {
                            return replacer(all, key, obj);
                        });
                    };
                }(), Snap._.clone = clone, Snap._.cacher = cacher, Snap.rad = rad, Snap.deg = deg, 
                Snap.sin = function(angle) {
                    return math.sin(Snap.rad(angle));
                }, Snap.tan = function(angle) {
                    return math.tan(Snap.rad(angle));
                }, Snap.cos = function(angle) {
                    return math.cos(Snap.rad(angle));
                }, Snap.asin = function(num) {
                    return Snap.deg(math.asin(num));
                }, Snap.acos = function(num) {
                    return Snap.deg(math.acos(num));
                }, Snap.atan = function(num) {
                    return Snap.deg(math.atan(num));
                }, Snap.atan2 = function(num) {
                    return Snap.deg(math.atan2(num));
                }, Snap.angle = angle, Snap.len = function(x1, y1, x2, y2) {
                    return Math.sqrt(Snap.len2(x1, y1, x2, y2));
                }, Snap.len2 = function(x1, y1, x2, y2) {
                    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
                }, Snap.closestPoint = function(path, x, y) {
                    function distance2(p) {
                        var dx = p.x - x, dy = p.y - y;
                        return dx * dx + dy * dy;
                    }
                    for (var best, bestLength, scan, scanDistance, pathNode = path.node, pathLength = pathNode.getTotalLength(), precision = pathLength / pathNode.pathSegList.numberOfItems * .125, bestDistance = 1 / 0, scanLength = 0; scanLength <= pathLength; scanLength += precision) (scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance && (best = scan, 
                    bestLength = scanLength, bestDistance = scanDistance);
                    for (precision *= .5; precision > .5; ) {
                        var before, after, beforeLength, afterLength, beforeDistance, afterDistance;
                        (beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance ? (best = before, 
                        bestLength = beforeLength, bestDistance = beforeDistance) : (afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance ? (best = after, 
                        bestLength = afterLength, bestDistance = afterDistance) : precision *= .5;
                    }
                    return best = {
                        x: best.x,
                        y: best.y,
                        length: bestLength,
                        distance: Math.sqrt(bestDistance)
                    };
                }, Snap.is = is, Snap.snapTo = function(values, value, tolerance) {
                    if (tolerance = is(tolerance, "finite") ? tolerance : 10, is(values, "array")) {
                        for (var i = values.length; i--; ) if (abs(values[i] - value) <= tolerance) return values[i];
                    } else {
                        values = +values;
                        var rem = value % values;
                        if (rem < tolerance) return value - rem;
                        if (rem > values - tolerance) return value - rem + values;
                    }
                    return value;
                }, Snap.getRGB = cacher(function(colour) {
                    if (!colour || (colour = Str(colour)).indexOf("-") + 1) return {
                        r: -1,
                        g: -1,
                        b: -1,
                        hex: "none",
                        error: 1,
                        toString: rgbtoString
                    };
                    if ("none" == colour) return {
                        r: -1,
                        g: -1,
                        b: -1,
                        hex: "none",
                        toString: rgbtoString
                    };
                    if (!(hsrg[has](colour.toLowerCase().substring(0, 2)) || "#" == colour.charAt()) && (colour = _toHex(colour)), 
                    !colour) return {
                        r: -1,
                        g: -1,
                        b: -1,
                        hex: "none",
                        error: 1,
                        toString: rgbtoString
                    };
                    var red, green, blue, opacity, t, values, rgb = colour.match(colourRegExp);
                    return rgb ? (rgb[2] && (blue = toInt(rgb[2].substring(5), 16), green = toInt(rgb[2].substring(3, 5), 16), 
                    red = toInt(rgb[2].substring(1, 3), 16)), rgb[3] && (blue = toInt((t = rgb[3].charAt(3)) + t, 16), 
                    green = toInt((t = rgb[3].charAt(2)) + t, 16), red = toInt((t = rgb[3].charAt(1)) + t, 16)), 
                    rgb[4] && (values = rgb[4].split(commaSpaces), red = toFloat(values[0]), "%" == values[0].slice(-1) && (red *= 2.55), 
                    green = toFloat(values[1]), "%" == values[1].slice(-1) && (green *= 2.55), blue = toFloat(values[2]), 
                    "%" == values[2].slice(-1) && (blue *= 2.55), "rgba" == rgb[1].toLowerCase().slice(0, 4) && (opacity = toFloat(values[3])), 
                    values[3] && "%" == values[3].slice(-1) && (opacity /= 100)), rgb[5] ? (values = rgb[5].split(commaSpaces), 
                    red = toFloat(values[0]), "%" == values[0].slice(-1) && (red /= 100), green = toFloat(values[1]), 
                    "%" == values[1].slice(-1) && (green /= 100), blue = toFloat(values[2]), "%" == values[2].slice(-1) && (blue /= 100), 
                    ("deg" == values[0].slice(-3) || "°" == values[0].slice(-1)) && (red /= 360), "hsba" == rgb[1].toLowerCase().slice(0, 4) && (opacity = toFloat(values[3])), 
                    values[3] && "%" == values[3].slice(-1) && (opacity /= 100), Snap.hsb2rgb(red, green, blue, opacity)) : rgb[6] ? (values = rgb[6].split(commaSpaces), 
                    red = toFloat(values[0]), "%" == values[0].slice(-1) && (red /= 100), green = toFloat(values[1]), 
                    "%" == values[1].slice(-1) && (green /= 100), blue = toFloat(values[2]), "%" == values[2].slice(-1) && (blue /= 100), 
                    ("deg" == values[0].slice(-3) || "°" == values[0].slice(-1)) && (red /= 360), "hsla" == rgb[1].toLowerCase().slice(0, 4) && (opacity = toFloat(values[3])), 
                    values[3] && "%" == values[3].slice(-1) && (opacity /= 100), Snap.hsl2rgb(red, green, blue, opacity)) : (red = mmin(math.round(red), 255), 
                    green = mmin(math.round(green), 255), blue = mmin(math.round(blue), 255), opacity = mmin(mmax(opacity, 0), 1), 
                    rgb = {
                        r: red,
                        g: green,
                        b: blue,
                        toString: rgbtoString
                    }, rgb.hex = "#" + (16777216 | blue | green << 8 | red << 16).toString(16).slice(1), 
                    rgb.opacity = is(opacity, "finite") ? opacity : 1, rgb)) : {
                        r: -1,
                        g: -1,
                        b: -1,
                        hex: "none",
                        error: 1,
                        toString: rgbtoString
                    };
                }, Snap), Snap.hsb = cacher(function(h, s, b) {
                    return Snap.hsb2rgb(h, s, b).hex;
                }), Snap.hsl = cacher(function(h, s, l) {
                    return Snap.hsl2rgb(h, s, l).hex;
                }), Snap.rgb = cacher(function(r, g, b, o) {
                    if (is(o, "finite")) {
                        var round = math.round;
                        return "rgba(" + [ round(r), round(g), round(b), +o.toFixed(2) ] + ")";
                    }
                    return "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1);
                });
                var _toHex = function(color) {
                    var i = glob.doc.getElementsByTagName("head")[0] || glob.doc.getElementsByTagName("svg")[0], red = "rgb(255, 0, 0)";
                    return (_toHex = cacher(function(color) {
                        if ("red" == color.toLowerCase()) return red;
                        i.style.color = red, i.style.color = color;
                        var out = glob.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
                        return out == red ? null : out;
                    }))(color);
                }, hsbtoString = function() {
                    return "hsb(" + [ this.h, this.s, this.b ] + ")";
                }, hsltoString = function() {
                    return "hsl(" + [ this.h, this.s, this.l ] + ")";
                }, rgbtoString = function() {
                    return 1 == this.opacity || null == this.opacity ? this.hex : "rgba(" + [ this.r, this.g, this.b, this.opacity ] + ")";
                }, prepareRGB = function(r, g, b) {
                    if (null == g && is(r, "object") && "r" in r && "g" in r && "b" in r && (b = r.b, 
                    g = r.g, r = r.r), null == g && is(r, string)) {
                        var clr = Snap.getRGB(r);
                        r = clr.r, g = clr.g, b = clr.b;
                    }
                    return (r > 1 || g > 1 || b > 1) && (r /= 255, g /= 255, b /= 255), [ r, g, b ];
                }, packageRGB = function(r, g, b, o) {
                    r = math.round(255 * r), g = math.round(255 * g), b = math.round(255 * b);
                    var rgb = {
                        r: r,
                        g: g,
                        b: b,
                        opacity: is(o, "finite") ? o : 1,
                        hex: Snap.rgb(r, g, b),
                        toString: rgbtoString
                    };
                    return is(o, "finite") && (rgb.opacity = o), rgb;
                };
                Snap.color = function(clr) {
                    var rgb;
                    return is(clr, "object") && "h" in clr && "s" in clr && "b" in clr ? (rgb = Snap.hsb2rgb(clr), 
                    clr.r = rgb.r, clr.g = rgb.g, clr.b = rgb.b, clr.opacity = 1, clr.hex = rgb.hex) : is(clr, "object") && "h" in clr && "s" in clr && "l" in clr ? (rgb = Snap.hsl2rgb(clr), 
                    clr.r = rgb.r, clr.g = rgb.g, clr.b = rgb.b, clr.opacity = 1, clr.hex = rgb.hex) : (is(clr, "string") && (clr = Snap.getRGB(clr)), 
                    is(clr, "object") && "r" in clr && "g" in clr && "b" in clr && !("error" in clr) ? (rgb = Snap.rgb2hsl(clr), 
                    clr.h = rgb.h, clr.s = rgb.s, clr.l = rgb.l, rgb = Snap.rgb2hsb(clr), clr.v = rgb.b) : (clr = {
                        hex: "none"
                    }, clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1, clr.error = 1)), 
                    clr.toString = rgbtoString, clr;
                }, Snap.hsb2rgb = function(h, s, v, o) {
                    is(h, "object") && "h" in h && "s" in h && "b" in h && (v = h.b, s = h.s, o = h.o, 
                    h = h.h), h *= 360;
                    var R, G, B, X, C;
                    return h = h % 360 / 60, C = v * s, X = C * (1 - abs(h % 2 - 1)), R = G = B = v - C, 
                    h = ~~h, R += [ C, X, 0, 0, X, C ][h], G += [ X, C, C, X, 0, 0 ][h], B += [ 0, 0, X, C, C, X ][h], 
                    packageRGB(R, G, B, o);
                }, Snap.hsl2rgb = function(h, s, l, o) {
                    is(h, "object") && "h" in h && "s" in h && "l" in h && (l = h.l, s = h.s, h = h.h), 
                    (h > 1 || s > 1 || l > 1) && (h /= 360, s /= 100, l /= 100), h *= 360;
                    var R, G, B, X, C;
                    return h = h % 360 / 60, C = 2 * s * (l < .5 ? l : 1 - l), X = C * (1 - abs(h % 2 - 1)), 
                    R = G = B = l - C / 2, h = ~~h, R += [ C, X, 0, 0, X, C ][h], G += [ X, C, C, X, 0, 0 ][h], 
                    B += [ 0, 0, X, C, C, X ][h], packageRGB(R, G, B, o);
                }, Snap.rgb2hsb = function(r, g, b) {
                    b = prepareRGB(r, g, b), r = b[0], g = b[1], b = b[2];
                    var H, S, V, C;
                    return V = mmax(r, g, b), C = V - mmin(r, g, b), H = 0 == C ? null : V == r ? (g - b) / C : V == g ? (b - r) / C + 2 : (r - g) / C + 4, 
                    H = (H + 360) % 6 * 60 / 360, S = 0 == C ? 0 : C / V, {
                        h: H,
                        s: S,
                        b: V,
                        toString: hsbtoString
                    };
                }, Snap.rgb2hsl = function(r, g, b) {
                    b = prepareRGB(r, g, b), r = b[0], g = b[1], b = b[2];
                    var H, S, L, M, m, C;
                    return M = mmax(r, g, b), m = mmin(r, g, b), C = M - m, H = 0 == C ? null : M == r ? (g - b) / C : M == g ? (b - r) / C + 2 : (r - g) / C + 4, 
                    H = (H + 360) % 6 * 60 / 360, L = (M + m) / 2, S = 0 == C ? 0 : L < .5 ? C / (2 * L) : C / (2 - 2 * L), 
                    {
                        h: H,
                        s: S,
                        l: L,
                        toString: hsltoString
                    };
                }, Snap.parsePathString = function(pathString) {
                    if (!pathString) return null;
                    var pth = Snap.path(pathString);
                    if (pth.arr) return Snap.path.clone(pth.arr);
                    var paramCounts = {
                        a: 7,
                        c: 6,
                        o: 2,
                        h: 1,
                        l: 2,
                        m: 2,
                        r: 4,
                        q: 4,
                        s: 4,
                        t: 2,
                        v: 1,
                        u: 3,
                        z: 0
                    }, data = [];
                    return is(pathString, "array") && is(pathString[0], "array") && (data = Snap.path.clone(pathString)), 
                    data.length || Str(pathString).replace(pathCommand, function(a, b, c) {
                        var params = [], name = b.toLowerCase();
                        if (c.replace(pathValues, function(a, b) {
                            b && params.push(+b);
                        }), "m" == name && params.length > 2 && (data.push([ b ].concat(params.splice(0, 2))), 
                        name = "l", b = "m" == b ? "l" : "L"), "o" == name && 1 == params.length && data.push([ b, params[0] ]), 
                        "r" == name) data.push([ b ].concat(params)); else for (;params.length >= paramCounts[name] && (data.push([ b ].concat(params.splice(0, paramCounts[name]))), 
                        paramCounts[name]); ) ;
                    }), data.toString = Snap.path.toString, pth.arr = Snap.path.clone(data), data;
                };
                var parseTransformString = Snap.parseTransformString = function(TString) {
                    if (!TString) return null;
                    var data = [];
                    return is(TString, "array") && is(TString[0], "array") && (data = Snap.path.clone(TString)), 
                    data.length || Str(TString).replace(tCommand, function(a, b, c) {
                        var params = [];
                        b.toLowerCase();
                        c.replace(pathValues, function(a, b) {
                            b && params.push(+b);
                        }), data.push([ b ].concat(params));
                    }), data.toString = Snap.path.toString, data;
                };
                Snap._.svgTransform2string = svgTransform2string, Snap._.rgTransform = /^[a-z][\s]*-?\.?\d/i, 
                Snap._.transform2matrix = transform2matrix, Snap._unit2px = unit2px;
                glob.doc.contains || glob.doc.compareDocumentPosition ? function(a, b) {
                    var adown = 9 == a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                    return a == bup || !(!bup || 1 != bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
                } : function(a, b) {
                    if (b) for (;b; ) if (b = b.parentNode, b == a) return !0;
                    return !1;
                };
                Snap._.getSomeDefs = getSomeDefs, Snap._.getSomeSVG = getSomeSVG, Snap.select = function(query) {
                    return query = Str(query).replace(/([^\\]):/g, "$1\\:"), wrap(glob.doc.querySelector(query));
                }, Snap.selectAll = function(query) {
                    for (var nodelist = glob.doc.querySelectorAll(query), set = (Snap.set || Array)(), i = 0; i < nodelist.length; i++) set.push(wrap(nodelist[i]));
                    return set;
                }, setInterval(function() {
                    for (var key in hub) if (hub[has](key)) {
                        var el = hub[key], node = el.node;
                        ("svg" != el.type && !node.ownerSVGElement || "svg" == el.type && (!node.parentNode || "ownerSVGElement" in node.parentNode && !node.ownerSVGElement)) && delete hub[key];
                    }
                }, 1e4), Element.prototype.attr = function(params, value) {
                    var el = this, node = el.node;
                    if (!params) {
                        if (1 != node.nodeType) return {
                            text: node.nodeValue
                        };
                        for (var attr = node.attributes, out = {}, i = 0, ii = attr.length; i < ii; i++) out[attr[i].nodeName] = attr[i].nodeValue;
                        return out;
                    }
                    if (is(params, "string")) {
                        if (!(arguments.length > 1)) return eve("snap.util.getattr." + params, el).firstDefined();
                        var json = {};
                        json[params] = value, params = json;
                    }
                    for (var att in params) params[has](att) && eve("snap.util.attr." + att, el, params[att]);
                    return el;
                }, Snap.parse = function(svg) {
                    var f = glob.doc.createDocumentFragment(), full = !0, div = glob.doc.createElement("div");
                    if (svg = Str(svg), svg.match(/^\s*<\s*svg(?:\s|>)/) || (svg = "<svg>" + svg + "</svg>", 
                    full = !1), div.innerHTML = svg, svg = div.getElementsByTagName("svg")[0]) if (full) f = svg; else for (;svg.firstChild; ) f.appendChild(svg.firstChild);
                    return new Fragment(f);
                }, Snap.fragment = function() {
                    for (var args = Array.prototype.slice.call(arguments, 0), f = glob.doc.createDocumentFragment(), i = 0, ii = args.length; i < ii; i++) {
                        var item = args[i];
                        item.node && item.node.nodeType && f.appendChild(item.node), item.nodeType && f.appendChild(item), 
                        "string" == typeof item && f.appendChild(Snap.parse(item).node);
                    }
                    return new Fragment(f);
                }, Snap._.make = make, Snap._.wrap = wrap, Paper.prototype.el = function(name, attr) {
                    var el = make(name, this.node);
                    return attr && el.attr(attr), el;
                }, Element.prototype.children = function() {
                    for (var out = [], ch = this.node.childNodes, i = 0, ii = ch.length; i < ii; i++) out[i] = Snap(ch[i]);
                    return out;
                }, Element.prototype.toJSON = function() {
                    var out = [];
                    return jsonFiller([ this ], out), out[0];
                }, eve.on("snap.util.getattr", function() {
                    var att = eve.nt();
                    att = att.substring(att.lastIndexOf(".") + 1);
                    var css = att.replace(/[A-Z]/g, function(letter) {
                        return "-" + letter.toLowerCase();
                    });
                    return cssAttr[has](css) ? this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(css) : $(this.node, att);
                });
                var cssAttr = {
                    "alignment-baseline": 0,
                    "baseline-shift": 0,
                    clip: 0,
                    "clip-path": 0,
                    "clip-rule": 0,
                    color: 0,
                    "color-interpolation": 0,
                    "color-interpolation-filters": 0,
                    "color-profile": 0,
                    "color-rendering": 0,
                    cursor: 0,
                    direction: 0,
                    display: 0,
                    "dominant-baseline": 0,
                    "enable-background": 0,
                    fill: 0,
                    "fill-opacity": 0,
                    "fill-rule": 0,
                    filter: 0,
                    "flood-color": 0,
                    "flood-opacity": 0,
                    font: 0,
                    "font-family": 0,
                    "font-size": 0,
                    "font-size-adjust": 0,
                    "font-stretch": 0,
                    "font-style": 0,
                    "font-variant": 0,
                    "font-weight": 0,
                    "glyph-orientation-horizontal": 0,
                    "glyph-orientation-vertical": 0,
                    "image-rendering": 0,
                    kerning: 0,
                    "letter-spacing": 0,
                    "lighting-color": 0,
                    marker: 0,
                    "marker-end": 0,
                    "marker-mid": 0,
                    "marker-start": 0,
                    mask: 0,
                    opacity: 0,
                    overflow: 0,
                    "pointer-events": 0,
                    "shape-rendering": 0,
                    "stop-color": 0,
                    "stop-opacity": 0,
                    stroke: 0,
                    "stroke-dasharray": 0,
                    "stroke-dashoffset": 0,
                    "stroke-linecap": 0,
                    "stroke-linejoin": 0,
                    "stroke-miterlimit": 0,
                    "stroke-opacity": 0,
                    "stroke-width": 0,
                    "text-anchor": 0,
                    "text-decoration": 0,
                    "text-rendering": 0,
                    "unicode-bidi": 0,
                    visibility: 0,
                    "word-spacing": 0,
                    "writing-mode": 0
                };
                eve.on("snap.util.attr", function(value) {
                    var att = eve.nt(), attr = {};
                    att = att.substring(att.lastIndexOf(".") + 1), attr[att] = value;
                    var style = att.replace(/-(\w)/gi, function(all, letter) {
                        return letter.toUpperCase();
                    }), css = att.replace(/[A-Z]/g, function(letter) {
                        return "-" + letter.toLowerCase();
                    });
                    cssAttr[has](css) ? this.node.style[style] = null == value ? E : value : $(this.node, attr);
                }), function(proto) {}(Paper.prototype), Snap.ajax = function(url, postData, callback, scope) {
                    var req = new XMLHttpRequest(), id = ID();
                    if (req) {
                        if (is(postData, "function")) scope = callback, callback = postData, postData = null; else if (is(postData, "object")) {
                            var pd = [];
                            for (var key in postData) postData.hasOwnProperty(key) && pd.push(encodeURIComponent(key) + "=" + encodeURIComponent(postData[key]));
                            postData = pd.join("&");
                        }
                        return req.open(postData ? "POST" : "GET", url, !0), postData && (req.setRequestHeader("X-Requested-With", "XMLHttpRequest"), 
                        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")), callback && (eve.once("snap.ajax." + id + ".0", callback), 
                        eve.once("snap.ajax." + id + ".200", callback), eve.once("snap.ajax." + id + ".304", callback)), 
                        req.onreadystatechange = function() {
                            4 == req.readyState && eve("snap.ajax." + id + "." + req.status, scope, req);
                        }, 4 == req.readyState ? req : (req.send(postData), req);
                    }
                }, Snap.load = function(url, callback, scope) {
                    Snap.ajax(url, function(req) {
                        var f = Snap.parse(req.responseText);
                        scope ? callback.call(scope, f) : callback(f);
                    });
                };
                var getOffset = function(elem) {
                    var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement, clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, top = box.top + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop) - clientTop, left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
                    return {
                        y: top,
                        x: left
                    };
                };
                return Snap.getElementByPoint = function(x, y) {
                    var paper = this, target = (paper.canvas, glob.doc.elementFromPoint(x, y));
                    if (glob.win.opera && "svg" == target.tagName) {
                        var so = getOffset(target), sr = target.createSVGRect();
                        sr.x = x - so.x, sr.y = y - so.y, sr.width = sr.height = 1;
                        var hits = target.getIntersectionList(sr, null);
                        hits.length && (target = hits[hits.length - 1]);
                    }
                    return target ? wrap(target) : null;
                }, Snap.plugin = function(f) {
                    f(Snap, Element, Paper, glob, Fragment);
                }, glob.win.Snap = Snap, Snap;
            }(window || this);
            return Snap.plugin(function(Snap, Element, Paper, glob, Fragment) {
                function extractTransform(el, tstr) {
                    if (null == tstr) {
                        var doReturn = !0;
                        if (tstr = "linearGradient" == el.type || "radialGradient" == el.type ? el.node.getAttribute("gradientTransform") : "pattern" == el.type ? el.node.getAttribute("patternTransform") : el.node.getAttribute("transform"), 
                        !tstr) return new Snap.Matrix();
                        tstr = Snap._.svgTransform2string(tstr);
                    } else tstr = Snap._.rgTransform.test(tstr) ? Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || E) : Snap._.svgTransform2string(tstr), 
                    is(tstr, "array") && (tstr = Snap.path ? Snap.path.toString.call(tstr) : Str(tstr)), 
                    el._.transform = tstr;
                    var m = Snap._.transform2matrix(tstr, el.getBBox(1));
                    return doReturn ? m : void (el.matrix = m);
                }
                function fixids(el) {
                    function urltest(it, name) {
                        var val = $(it.node, name);
                        val = val && val.match(url), val = val && val[2], val && "#" == val.charAt() && (val = val.substring(1), 
                        val && (uses[val] = (uses[val] || []).concat(function(id) {
                            var attr = {};
                            attr[name] = URL(id), $(it.node, attr);
                        })));
                    }
                    function linktest(it) {
                        var val = $(it.node, "xlink:href");
                        val && "#" == val.charAt() && (val = val.substring(1), val && (uses[val] = (uses[val] || []).concat(function(id) {
                            it.attr("xlink:href", "#" + id);
                        })));
                    }
                    for (var it, els = el.selectAll("*"), url = /^\s*url\(("|'|)(.*)\1\)\s*$/, ids = [], uses = {}, i = 0, ii = els.length; i < ii; i++) {
                        it = els[i], urltest(it, "fill"), urltest(it, "stroke"), urltest(it, "filter"), 
                        urltest(it, "mask"), urltest(it, "clip-path"), linktest(it);
                        var oldid = $(it.node, "id");
                        oldid && ($(it.node, {
                            id: it.id
                        }), ids.push({
                            old: oldid,
                            id: it.id
                        }));
                    }
                    for (i = 0, ii = ids.length; i < ii; i++) {
                        var fs = uses[ids[i].old];
                        if (fs) for (var j = 0, jj = fs.length; j < jj; j++) fs[j](ids[i].id);
                    }
                }
                function slice(from, to, f) {
                    return function(arr) {
                        var res = arr.slice(from, to);
                        return 1 == res.length && (res = res[0]), f ? f(res) : res;
                    };
                }
                function toString(type) {
                    return function() {
                        var res = type ? "<" + this.type : "", attr = this.node.attributes, chld = this.node.childNodes;
                        if (type) for (var i = 0, ii = attr.length; i < ii; i++) res += " " + attr[i].name + '="' + attr[i].value.replace(/"/g, '\\"') + '"';
                        if (chld.length) {
                            for (type && (res += ">"), i = 0, ii = chld.length; i < ii; i++) 3 == chld[i].nodeType ? res += chld[i].nodeValue : 1 == chld[i].nodeType && (res += wrap(chld[i]).toString());
                            type && (res += "</" + this.type + ">");
                        } else type && (res += "/>");
                        return res;
                    };
                }
                var elproto = Element.prototype, is = Snap.is, Str = String, unit2px = Snap._unit2px, $ = Snap._.$, make = Snap._.make, getSomeDefs = Snap._.getSomeDefs, has = "hasOwnProperty", wrap = Snap._.wrap;
                elproto.getBBox = function(isWithoutTransform) {
                    if (!Snap.Matrix || !Snap.path) return this.node.getBBox();
                    var el = this, m = new Snap.Matrix();
                    if (el.removed) return Snap._.box();
                    for (;"use" == el.type; ) if (isWithoutTransform || (m = m.add(el.transform().localMatrix.translate(el.attr("x") || 0, el.attr("y") || 0))), 
                    el.original) el = el.original; else {
                        var href = el.attr("xlink:href");
                        el = el.original = el.node.ownerDocument.getElementById(href.substring(href.indexOf("#") + 1));
                    }
                    var _ = el._, pathfinder = Snap.path.get[el.type] || Snap.path.get.deflt;
                    try {
                        return isWithoutTransform ? (_.bboxwt = pathfinder ? Snap.path.getBBox(el.realPath = pathfinder(el)) : Snap._.box(el.node.getBBox()), 
                        Snap._.box(_.bboxwt)) : (el.realPath = pathfinder(el), el.matrix = el.transform().localMatrix, 
                        _.bbox = Snap.path.getBBox(Snap.path.map(el.realPath, m.add(el.matrix))), Snap._.box(_.bbox));
                    } catch (e) {
                        return Snap._.box();
                    }
                };
                var propString = function() {
                    return this.string;
                };
                elproto.transform = function(tstr) {
                    var _ = this._;
                    if (null == tstr) {
                        for (var i, papa = this, global = new Snap.Matrix(this.node.getCTM()), local = extractTransform(this), ms = [ local ], m = new Snap.Matrix(), localString = local.toTransformString(), string = Str(local) == Str(this.matrix) ? Str(_.transform) : localString; "svg" != papa.type && (papa = papa.parent()); ) ms.push(extractTransform(papa));
                        for (i = ms.length; i--; ) m.add(ms[i]);
                        return {
                            string: string,
                            globalMatrix: global,
                            totalMatrix: m,
                            localMatrix: local,
                            diffMatrix: global.clone().add(local.invert()),
                            global: global.toTransformString(),
                            total: m.toTransformString(),
                            local: localString,
                            toString: propString
                        };
                    }
                    return tstr instanceof Snap.Matrix ? (this.matrix = tstr, this._.transform = tstr.toTransformString()) : extractTransform(this, tstr), 
                    this.node && ("linearGradient" == this.type || "radialGradient" == this.type ? $(this.node, {
                        gradientTransform: this.matrix
                    }) : "pattern" == this.type ? $(this.node, {
                        patternTransform: this.matrix
                    }) : $(this.node, {
                        transform: this.matrix
                    })), this;
                }, elproto.parent = function() {
                    return wrap(this.node.parentNode);
                }, elproto.append = elproto.add = function(el) {
                    if (el) {
                        if ("set" == el.type) {
                            var it = this;
                            return el.forEach(function(el) {
                                it.add(el);
                            }), this;
                        }
                        el = wrap(el), this.node.appendChild(el.node), el.paper = this.paper;
                    }
                    return this;
                }, elproto.appendTo = function(el) {
                    return el && (el = wrap(el), el.append(this)), this;
                }, elproto.prepend = function(el) {
                    if (el) {
                        if ("set" == el.type) {
                            var first, it = this;
                            return el.forEach(function(el) {
                                first ? first.after(el) : it.prepend(el), first = el;
                            }), this;
                        }
                        el = wrap(el);
                        var parent = el.parent();
                        this.node.insertBefore(el.node, this.node.firstChild), this.add && this.add(), el.paper = this.paper, 
                        this.parent() && this.parent().add(), parent && parent.add();
                    }
                    return this;
                }, elproto.prependTo = function(el) {
                    return el = wrap(el), el.prepend(this), this;
                }, elproto.before = function(el) {
                    if ("set" == el.type) {
                        var it = this;
                        return el.forEach(function(el) {
                            var parent = el.parent();
                            it.node.parentNode.insertBefore(el.node, it.node), parent && parent.add();
                        }), this.parent().add(), this;
                    }
                    el = wrap(el);
                    var parent = el.parent();
                    return this.node.parentNode.insertBefore(el.node, this.node), this.parent() && this.parent().add(), 
                    parent && parent.add(), el.paper = this.paper, this;
                }, elproto.after = function(el) {
                    el = wrap(el);
                    var parent = el.parent();
                    return this.node.nextSibling ? this.node.parentNode.insertBefore(el.node, this.node.nextSibling) : this.node.parentNode.appendChild(el.node), 
                    this.parent() && this.parent().add(), parent && parent.add(), el.paper = this.paper, 
                    this;
                }, elproto.insertBefore = function(el) {
                    el = wrap(el);
                    var parent = this.parent();
                    return el.node.parentNode.insertBefore(this.node, el.node), this.paper = el.paper, 
                    parent && parent.add(), el.parent() && el.parent().add(), this;
                }, elproto.insertAfter = function(el) {
                    el = wrap(el);
                    var parent = this.parent();
                    return el.node.parentNode.insertBefore(this.node, el.node.nextSibling), this.paper = el.paper, 
                    parent && parent.add(), el.parent() && el.parent().add(), this;
                }, elproto.remove = function() {
                    var parent = this.parent();
                    return this.node.parentNode && this.node.parentNode.removeChild(this.node), delete this.paper, 
                    this.removed = !0, parent && parent.add(), this;
                }, elproto.select = function(query) {
                    return query = Str(query).replace(/([^\\]):/g, "$1\\:"), wrap(this.node.querySelector(query));
                }, elproto.selectAll = function(query) {
                    for (var nodelist = this.node.querySelectorAll(query), set = (Snap.set || Array)(), i = 0; i < nodelist.length; i++) set.push(wrap(nodelist[i]));
                    return set;
                }, elproto.asPX = function(attr, value) {
                    return null == value && (value = this.attr(attr)), +unit2px(this, attr, value);
                }, elproto.use = function() {
                    var use, id = this.node.id;
                    return id || (id = this.id, $(this.node, {
                        id: id
                    })), use = "linearGradient" == this.type || "radialGradient" == this.type || "pattern" == this.type ? make(this.type, this.node.parentNode) : make("use", this.node.parentNode), 
                    $(use.node, {
                        "xlink:href": "#" + id
                    }), use.original = this, use;
                }, elproto.clone = function() {
                    var clone = wrap(this.node.cloneNode(!0));
                    return $(clone.node, "id") && $(clone.node, {
                        id: clone.id
                    }), fixids(clone), clone.insertAfter(this), clone;
                }, elproto.toDefs = function() {
                    var defs = getSomeDefs(this);
                    return defs.appendChild(this.node), this;
                }, elproto.pattern = elproto.toPattern = function(x, y, width, height) {
                    var p = make("pattern", getSomeDefs(this));
                    return null == x && (x = this.getBBox()), is(x, "object") && "x" in x && (y = x.y, 
                    width = x.width, height = x.height, x = x.x), $(p.node, {
                        x: x,
                        y: y,
                        width: width,
                        height: height,
                        patternUnits: "userSpaceOnUse",
                        id: p.id,
                        viewBox: [ x, y, width, height ].join(" ")
                    }), p.node.appendChild(this.node), p;
                }, elproto.marker = function(x, y, width, height, refX, refY) {
                    var p = make("marker", getSomeDefs(this));
                    return null == x && (x = this.getBBox()), is(x, "object") && "x" in x && (y = x.y, 
                    width = x.width, height = x.height, refX = x.refX || x.cx, refY = x.refY || x.cy, 
                    x = x.x), $(p.node, {
                        viewBox: [ x, y, width, height ].join(" "),
                        markerWidth: width,
                        markerHeight: height,
                        orient: "auto",
                        refX: refX || 0,
                        refY: refY || 0,
                        id: p.id
                    }), p.node.appendChild(this.node), p;
                };
                var Animation = function(attr, ms, easing, callback) {
                    "function" != typeof easing || easing.length || (callback = easing, easing = mina.linear), 
                    this.attr = attr, this.dur = ms, easing && (this.easing = easing), callback && (this.callback = callback);
                };
                Snap._.Animation = Animation, Snap.animation = function(attr, ms, easing, callback) {
                    return new Animation(attr, ms, easing, callback);
                }, elproto.inAnim = function() {
                    var el = this, res = [];
                    for (var id in el.anims) el.anims[has](id) && !function(a) {
                        res.push({
                            anim: new Animation(a._attrs, a.dur, a.easing, a._callback),
                            mina: a,
                            curStatus: a.status(),
                            status: function(val) {
                                return a.status(val);
                            },
                            stop: function() {
                                a.stop();
                            }
                        });
                    }(el.anims[id]);
                    return res;
                }, Snap.animate = function(from, to, setter, ms, easing, callback) {
                    "function" != typeof easing || easing.length || (callback = easing, easing = mina.linear);
                    var now = mina.time(), anim = mina(from, to, now, now + ms, mina.time, setter, easing);
                    return callback && eve.once("mina.finish." + anim.id, callback), anim;
                }, elproto.stop = function() {
                    for (var anims = this.inAnim(), i = 0, ii = anims.length; i < ii; i++) anims[i].stop();
                    return this;
                }, elproto.animate = function(attrs, ms, easing, callback) {
                    "function" != typeof easing || easing.length || (callback = easing, easing = mina.linear), 
                    attrs instanceof Animation && (callback = attrs.callback, easing = attrs.easing, 
                    ms = easing.dur, attrs = attrs.attr);
                    var from, to, f, eq, fkeys = [], tkeys = [], keys = {}, el = this;
                    for (var key in attrs) if (attrs[has](key)) {
                        el.equal ? (eq = el.equal(key, Str(attrs[key])), from = eq.from, to = eq.to, f = eq.f) : (from = +el.attr(key), 
                        to = +attrs[key]);
                        var len = is(from, "array") ? from.length : 1;
                        keys[key] = slice(fkeys.length, fkeys.length + len, f), fkeys = fkeys.concat(from), 
                        tkeys = tkeys.concat(to);
                    }
                    var now = mina.time(), anim = mina(fkeys, tkeys, now, now + ms, mina.time, function(val) {
                        var attr = {};
                        for (var key in keys) keys[has](key) && (attr[key] = keys[key](val));
                        el.attr(attr);
                    }, easing);
                    return el.anims[anim.id] = anim, anim._attrs = attrs, anim._callback = callback, 
                    eve("snap.animcreated." + el.id, anim), eve.once("mina.finish." + anim.id, function() {
                        delete el.anims[anim.id], callback && callback.call(el);
                    }), eve.once("mina.stop." + anim.id, function() {
                        delete el.anims[anim.id];
                    }), el;
                };
                var eldata = {};
                elproto.data = function(key, value) {
                    var data = eldata[this.id] = eldata[this.id] || {};
                    if (0 == arguments.length) return eve("snap.data.get." + this.id, this, data, null), 
                    data;
                    if (1 == arguments.length) {
                        if (Snap.is(key, "object")) {
                            for (var i in key) key[has](i) && this.data(i, key[i]);
                            return this;
                        }
                        return eve("snap.data.get." + this.id, this, data[key], key), data[key];
                    }
                    return data[key] = value, eve("snap.data.set." + this.id, this, value, key), this;
                }, elproto.removeData = function(key) {
                    return null == key ? eldata[this.id] = {} : eldata[this.id] && delete eldata[this.id][key], 
                    this;
                }, elproto.outerSVG = elproto.toString = toString(1), elproto.innerSVG = toString(), 
                elproto.toDataURL = function() {
                    if (window && window.btoa) {
                        var bb = this.getBBox(), svg = Snap.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
                            x: +bb.x.toFixed(3),
                            y: +bb.y.toFixed(3),
                            width: +bb.width.toFixed(3),
                            height: +bb.height.toFixed(3),
                            contents: this.outerSVG()
                        });
                        return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
                    }
                }, Fragment.prototype.select = elproto.select, Fragment.prototype.selectAll = elproto.selectAll;
            }), Snap.plugin(function(Snap, Element, Paper, glob, Fragment) {
                function Matrix(a, b, c, d, e, f) {
                    return null == b && "[object SVGMatrix]" == objectToString.call(a) ? (this.a = a.a, 
                    this.b = a.b, this.c = a.c, this.d = a.d, this.e = a.e, void (this.f = a.f)) : void (null != a ? (this.a = +a, 
                    this.b = +b, this.c = +c, this.d = +d, this.e = +e, this.f = +f) : (this.a = 1, 
                    this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0));
                }
                var objectToString = Object.prototype.toString, Str = String, math = Math, E = "";
                !function(matrixproto) {
                    function norm(a) {
                        return a[0] * a[0] + a[1] * a[1];
                    }
                    function normalize(a) {
                        var mag = math.sqrt(norm(a));
                        a[0] && (a[0] /= mag), a[1] && (a[1] /= mag);
                    }
                    matrixproto.add = function(a, b, c, d, e, f) {
                        var x, y, z, res, out = [ [], [], [] ], m = [ [ this.a, this.c, this.e ], [ this.b, this.d, this.f ], [ 0, 0, 1 ] ], matrix = [ [ a, c, e ], [ b, d, f ], [ 0, 0, 1 ] ];
                        for (a && a instanceof Matrix && (matrix = [ [ a.a, a.c, a.e ], [ a.b, a.d, a.f ], [ 0, 0, 1 ] ]), 
                        x = 0; x < 3; x++) for (y = 0; y < 3; y++) {
                            for (res = 0, z = 0; z < 3; z++) res += m[x][z] * matrix[z][y];
                            out[x][y] = res;
                        }
                        return this.a = out[0][0], this.b = out[1][0], this.c = out[0][1], this.d = out[1][1], 
                        this.e = out[0][2], this.f = out[1][2], this;
                    }, matrixproto.invert = function() {
                        var me = this, x = me.a * me.d - me.b * me.c;
                        return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
                    }, matrixproto.clone = function() {
                        return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
                    }, matrixproto.translate = function(x, y) {
                        return this.add(1, 0, 0, 1, x, y);
                    }, matrixproto.scale = function(x, y, cx, cy) {
                        return null == y && (y = x), (cx || cy) && this.add(1, 0, 0, 1, cx, cy), this.add(x, 0, 0, y, 0, 0), 
                        (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy), this;
                    }, matrixproto.rotate = function(a, x, y) {
                        a = Snap.rad(a), x = x || 0, y = y || 0;
                        var cos = +math.cos(a).toFixed(9), sin = +math.sin(a).toFixed(9);
                        return this.add(cos, sin, -sin, cos, x, y), this.add(1, 0, 0, 1, -x, -y);
                    }, matrixproto.x = function(x, y) {
                        return x * this.a + y * this.c + this.e;
                    }, matrixproto.y = function(x, y) {
                        return x * this.b + y * this.d + this.f;
                    }, matrixproto.get = function(i) {
                        return +this[Str.fromCharCode(97 + i)].toFixed(4);
                    }, matrixproto.toString = function() {
                        return "matrix(" + [ this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5) ].join() + ")";
                    }, matrixproto.offset = function() {
                        return [ this.e.toFixed(4), this.f.toFixed(4) ];
                    }, matrixproto.determinant = function() {
                        return this.a * this.d - this.b * this.c;
                    }, matrixproto.split = function() {
                        var out = {};
                        out.dx = this.e, out.dy = this.f;
                        var row = [ [ this.a, this.c ], [ this.b, this.d ] ];
                        out.scalex = math.sqrt(norm(row[0])), normalize(row[0]), out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1], 
                        row[1] = [ row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear ], 
                        out.scaley = math.sqrt(norm(row[1])), normalize(row[1]), out.shear /= out.scaley, 
                        this.determinant() < 0 && (out.scalex = -out.scalex);
                        var sin = -row[0][1], cos = row[1][1];
                        return cos < 0 ? (out.rotate = Snap.deg(math.acos(cos)), sin < 0 && (out.rotate = 360 - out.rotate)) : out.rotate = Snap.deg(math.asin(sin)), 
                        out.isSimple = !(+out.shear.toFixed(9) || out.scalex.toFixed(9) != out.scaley.toFixed(9) && out.rotate), 
                        out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate, 
                        out.noRotation = !+out.shear.toFixed(9) && !out.rotate, out;
                    }, matrixproto.toTransformString = function(shorter) {
                        var s = shorter || this.split();
                        return +s.shear.toFixed(9) ? "m" + [ this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5) ] : (s.scalex = +s.scalex.toFixed(4), 
                        s.scaley = +s.scaley.toFixed(4), s.rotate = +s.rotate.toFixed(4), (s.dx || s.dy ? "t" + [ +s.dx.toFixed(4), +s.dy.toFixed(4) ] : E) + (1 != s.scalex || 1 != s.scaley ? "s" + [ s.scalex, s.scaley, 0, 0 ] : E) + (s.rotate ? "r" + [ +s.rotate.toFixed(4), 0, 0 ] : E));
                    };
                }(Matrix.prototype), Snap.Matrix = Matrix, Snap.matrix = function(a, b, c, d, e, f) {
                    return new Matrix(a, b, c, d, e, f);
                };
            }), Snap.plugin(function(Snap, Element, Paper, glob, Fragment) {
                function fillStroke(name) {
                    return function(value) {
                        if (eve.stop(), value instanceof Fragment && 1 == value.node.childNodes.length && ("radialGradient" == value.node.firstChild.tagName || "linearGradient" == value.node.firstChild.tagName || "pattern" == value.node.firstChild.tagName) && (value = value.node.firstChild, 
                        getSomeDefs(this).appendChild(value), value = wrap(value)), value instanceof Element) if ("radialGradient" == value.type || "linearGradient" == value.type || "pattern" == value.type) {
                            value.node.id || $(value.node, {
                                id: value.id
                            });
                            var fill = URL(value.node.id);
                        } else fill = value.attr(name); else if (fill = Snap.color(value), fill.error) {
                            var grad = Snap(getSomeDefs(this).ownerSVGElement).gradient(value);
                            grad ? (grad.node.id || $(grad.node, {
                                id: grad.id
                            }), fill = URL(grad.node.id)) : fill = value;
                        } else fill = Str(fill);
                        var attrs = {};
                        attrs[name] = fill, $(this.node, attrs), this.node.style[name] = E;
                    };
                }
                function setFontSize(value) {
                    eve.stop(), value == +value && (value += "px"), this.node.style.fontSize = value;
                }
                function textExtract(node) {
                    for (var out = [], children = node.childNodes, i = 0, ii = children.length; i < ii; i++) {
                        var chi = children[i];
                        3 == chi.nodeType && out.push(chi.nodeValue), "tspan" == chi.tagName && (1 == chi.childNodes.length && 3 == chi.firstChild.nodeType ? out.push(chi.firstChild.nodeValue) : out.push(textExtract(chi)));
                    }
                    return out;
                }
                function getFontSize() {
                    return eve.stop(), this.node.style.fontSize;
                }
                var make = Snap._.make, wrap = Snap._.wrap, is = Snap.is, getSomeDefs = Snap._.getSomeDefs, reURLValue = /^url\(#?([^)]+)\)$/, $ = Snap._.$, URL = Snap.url, Str = String, separator = Snap._.separator, E = "";
                eve.on("snap.util.attr.mask", function(value) {
                    if (value instanceof Element || value instanceof Fragment) {
                        if (eve.stop(), value instanceof Fragment && 1 == value.node.childNodes.length && (value = value.node.firstChild, 
                        getSomeDefs(this).appendChild(value), value = wrap(value)), "mask" == value.type) var mask = value; else mask = make("mask", getSomeDefs(this)), 
                        mask.node.appendChild(value.node);
                        !mask.node.id && $(mask.node, {
                            id: mask.id
                        }), $(this.node, {
                            mask: URL(mask.id)
                        });
                    }
                }), function(clipIt) {
                    eve.on("snap.util.attr.clip", clipIt), eve.on("snap.util.attr.clip-path", clipIt), 
                    eve.on("snap.util.attr.clipPath", clipIt);
                }(function(value) {
                    if (value instanceof Element || value instanceof Fragment) {
                        if (eve.stop(), "clipPath" == value.type) var clip = value; else clip = make("clipPath", getSomeDefs(this)), 
                        clip.node.appendChild(value.node), !clip.node.id && $(clip.node, {
                            id: clip.id
                        });
                        $(this.node, {
                            "clip-path": URL(clip.node.id || clip.id)
                        });
                    }
                }), eve.on("snap.util.attr.fill", fillStroke("fill")), eve.on("snap.util.attr.stroke", fillStroke("stroke"));
                var gradrg = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
                eve.on("snap.util.grad.parse", function(string) {
                    string = Str(string);
                    var tokens = string.match(gradrg);
                    if (!tokens) return null;
                    var type = tokens[1], params = tokens[2], stops = tokens[3];
                    return params = params.split(/\s*,\s*/).map(function(el) {
                        return +el == el ? +el : el;
                    }), 1 == params.length && 0 == params[0] && (params = []), stops = stops.split("-"), 
                    stops = stops.map(function(el) {
                        el = el.split(":");
                        var out = {
                            color: el[0]
                        };
                        return el[1] && (out.offset = parseFloat(el[1])), out;
                    }), {
                        type: type,
                        params: params,
                        stops: stops
                    };
                }), eve.on("snap.util.attr.d", function(value) {
                    eve.stop(), is(value, "array") && is(value[0], "array") && (value = Snap.path.toString.call(value)), 
                    value = Str(value), value.match(/[ruo]/i) && (value = Snap.path.toAbsolute(value)), 
                    $(this.node, {
                        d: value
                    });
                })(-1), eve.on("snap.util.attr.#text", function(value) {
                    eve.stop(), value = Str(value);
                    for (var txt = glob.doc.createTextNode(value); this.node.firstChild; ) this.node.removeChild(this.node.firstChild);
                    this.node.appendChild(txt);
                })(-1), eve.on("snap.util.attr.path", function(value) {
                    eve.stop(), this.attr({
                        d: value
                    });
                })(-1), eve.on("snap.util.attr.class", function(value) {
                    eve.stop(), this.node.className.baseVal = value;
                })(-1), eve.on("snap.util.attr.viewBox", function(value) {
                    var vb;
                    vb = is(value, "object") && "x" in value ? [ value.x, value.y, value.width, value.height ].join(" ") : is(value, "array") ? value.join(" ") : value, 
                    $(this.node, {
                        viewBox: vb
                    }), eve.stop();
                })(-1), eve.on("snap.util.attr.transform", function(value) {
                    this.transform(value), eve.stop();
                })(-1), eve.on("snap.util.attr.r", function(value) {
                    "rect" == this.type && (eve.stop(), $(this.node, {
                        rx: value,
                        ry: value
                    }));
                })(-1), eve.on("snap.util.attr.textpath", function(value) {
                    if (eve.stop(), "text" == this.type) {
                        var id, tp, node;
                        if (!value && this.textPath) {
                            for (tp = this.textPath; tp.node.firstChild; ) this.node.appendChild(tp.node.firstChild);
                            return tp.remove(), void delete this.textPath;
                        }
                        if (is(value, "string")) {
                            var defs = getSomeDefs(this), path = wrap(defs.parentNode).path(value);
                            defs.appendChild(path.node), id = path.id, path.attr({
                                id: id
                            });
                        } else value = wrap(value), value instanceof Element && (id = value.attr("id"), 
                        id || (id = value.id, value.attr({
                            id: id
                        })));
                        if (id) if (tp = this.textPath, node = this.node, tp) tp.attr({
                            "xlink:href": "#" + id
                        }); else {
                            for (tp = $("textPath", {
                                "xlink:href": "#" + id
                            }); node.firstChild; ) tp.appendChild(node.firstChild);
                            node.appendChild(tp), this.textPath = wrap(tp);
                        }
                    }
                })(-1), eve.on("snap.util.attr.text", function(value) {
                    if ("text" == this.type) {
                        for (var node = this.node, tuner = function tuner(chunk) {
                            var out = $("tspan");
                            if (is(chunk, "array")) for (var i = 0; i < chunk.length; i++) out.appendChild(tuner(chunk[i])); else out.appendChild(glob.doc.createTextNode(chunk));
                            return out.normalize && out.normalize(), out;
                        }; node.firstChild; ) node.removeChild(node.firstChild);
                        for (var tuned = tuner(value); tuned.firstChild; ) node.appendChild(tuned.firstChild);
                    }
                    eve.stop();
                })(-1), eve.on("snap.util.attr.fontSize", setFontSize)(-1), eve.on("snap.util.attr.font-size", setFontSize)(-1), 
                eve.on("snap.util.getattr.transform", function() {
                    return eve.stop(), this.transform();
                })(-1), eve.on("snap.util.getattr.textpath", function() {
                    return eve.stop(), this.textPath;
                })(-1), function() {
                    function getter(end) {
                        return function() {
                            eve.stop();
                            var style = glob.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + end);
                            return "none" == style ? style : Snap(glob.doc.getElementById(style.match(reURLValue)[1]));
                        };
                    }
                    function setter(end) {
                        return function(value) {
                            eve.stop();
                            var name = "marker" + end.charAt(0).toUpperCase() + end.substring(1);
                            if ("" == value || !value) return void (this.node.style[name] = "none");
                            if ("marker" == value.type) {
                                var id = value.node.id;
                                return id || $(value.node, {
                                    id: value.id
                                }), void (this.node.style[name] = URL(id));
                            }
                        };
                    }
                    eve.on("snap.util.getattr.marker-end", getter("end"))(-1), eve.on("snap.util.getattr.markerEnd", getter("end"))(-1), 
                    eve.on("snap.util.getattr.marker-start", getter("start"))(-1), eve.on("snap.util.getattr.markerStart", getter("start"))(-1), 
                    eve.on("snap.util.getattr.marker-mid", getter("mid"))(-1), eve.on("snap.util.getattr.markerMid", getter("mid"))(-1), 
                    eve.on("snap.util.attr.marker-end", setter("end"))(-1), eve.on("snap.util.attr.markerEnd", setter("end"))(-1), 
                    eve.on("snap.util.attr.marker-start", setter("start"))(-1), eve.on("snap.util.attr.markerStart", setter("start"))(-1), 
                    eve.on("snap.util.attr.marker-mid", setter("mid"))(-1), eve.on("snap.util.attr.markerMid", setter("mid"))(-1);
                }(), eve.on("snap.util.getattr.r", function() {
                    if ("rect" == this.type && $(this.node, "rx") == $(this.node, "ry")) return eve.stop(), 
                    $(this.node, "rx");
                })(-1), eve.on("snap.util.getattr.text", function() {
                    if ("text" == this.type || "tspan" == this.type) {
                        eve.stop();
                        var out = textExtract(this.node);
                        return 1 == out.length ? out[0] : out;
                    }
                })(-1), eve.on("snap.util.getattr.#text", function() {
                    return this.node.textContent;
                })(-1), eve.on("snap.util.getattr.viewBox", function() {
                    eve.stop();
                    var vb = $(this.node, "viewBox");
                    return vb ? (vb = vb.split(separator), Snap._.box(+vb[0], +vb[1], +vb[2], +vb[3])) : void 0;
                })(-1), eve.on("snap.util.getattr.points", function() {
                    var p = $(this.node, "points");
                    return eve.stop(), p ? p.split(separator) : void 0;
                })(-1), eve.on("snap.util.getattr.path", function() {
                    var p = $(this.node, "d");
                    return eve.stop(), p;
                })(-1), eve.on("snap.util.getattr.class", function() {
                    return this.node.className.baseVal;
                })(-1), eve.on("snap.util.getattr.fontSize", getFontSize)(-1), eve.on("snap.util.getattr.font-size", getFontSize)(-1);
            }), Snap.plugin(function(Snap, Element, Paper, glob, Fragment) {
                var rgNotSpace = /\S+/g, Str = String, elproto = Element.prototype;
                elproto.addClass = function(value) {
                    var j, pos, clazz, finalValue, classes = Str(value || "").match(rgNotSpace) || [], elem = this.node, className = elem.className.baseVal, curClasses = className.match(rgNotSpace) || [];
                    if (classes.length) {
                        for (j = 0; clazz = classes[j++]; ) pos = curClasses.indexOf(clazz), ~pos || curClasses.push(clazz);
                        finalValue = curClasses.join(" "), className != finalValue && (elem.className.baseVal = finalValue);
                    }
                    return this;
                }, elproto.removeClass = function(value) {
                    var j, pos, clazz, finalValue, classes = Str(value || "").match(rgNotSpace) || [], elem = this.node, className = elem.className.baseVal, curClasses = className.match(rgNotSpace) || [];
                    if (curClasses.length) {
                        for (j = 0; clazz = classes[j++]; ) pos = curClasses.indexOf(clazz), ~pos && curClasses.splice(pos, 1);
                        finalValue = curClasses.join(" "), className != finalValue && (elem.className.baseVal = finalValue);
                    }
                    return this;
                }, elproto.hasClass = function(value) {
                    var elem = this.node, className = elem.className.baseVal, curClasses = className.match(rgNotSpace) || [];
                    return !!~curClasses.indexOf(value);
                }, elproto.toggleClass = function(value, flag) {
                    if (null != flag) return flag ? this.addClass(value) : this.removeClass(value);
                    var j, pos, clazz, finalValue, classes = (value || "").match(rgNotSpace) || [], elem = this.node, className = elem.className.baseVal, curClasses = className.match(rgNotSpace) || [];
                    for (j = 0; clazz = classes[j++]; ) pos = curClasses.indexOf(clazz), ~pos ? curClasses.splice(pos, 1) : curClasses.push(clazz);
                    return finalValue = curClasses.join(" "), className != finalValue && (elem.className.baseVal = finalValue), 
                    this;
                };
            }), Snap.plugin(function(Snap, Element, Paper, glob, Fragment) {
                function getNumber(val) {
                    return val;
                }
                function getUnit(unit) {
                    return function(val) {
                        return +val.toFixed(3) + unit;
                    };
                }
                var operators = {
                    "+": function(x, y) {
                        return x + y;
                    },
                    "-": function(x, y) {
                        return x - y;
                    },
                    "/": function(x, y) {
                        return x / y;
                    },
                    "*": function(x, y) {
                        return x * y;
                    }
                }, Str = String, reUnit = /[a-z]+$/i, reAddon = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
                eve.on("snap.util.attr", function(val) {
                    var plus = Str(val).match(reAddon);
                    if (plus) {
                        var evnt = eve.nt(), name = evnt.substring(evnt.lastIndexOf(".") + 1), a = this.attr(name), atr = {};
                        eve.stop();
                        var unit = plus[3] || "", aUnit = a.match(reUnit), op = operators[plus[1]];
                        if (aUnit && aUnit == unit ? val = op(parseFloat(a), +plus[2]) : (a = this.asPX(name), 
                        val = op(this.asPX(name), this.asPX(name, plus[2] + unit))), isNaN(a) || isNaN(val)) return;
                        atr[name] = val, this.attr(atr);
                    }
                })(-10), eve.on("snap.util.equal", function(name, b) {
                    var a = Str(this.attr(name) || ""), bplus = Str(b).match(reAddon);
                    if (bplus) {
                        eve.stop();
                        var unit = bplus[3] || "", aUnit = a.match(reUnit), op = operators[bplus[1]];
                        return aUnit && aUnit == unit ? {
                            from: parseFloat(a),
                            to: op(parseFloat(a), +bplus[2]),
                            f: getUnit(aUnit)
                        } : (a = this.asPX(name), {
                            from: a,
                            to: op(a, this.asPX(name, bplus[2] + unit)),
                            f: getNumber
                        });
                    }
                })(-10);
            }), Snap.plugin(function(Snap, Element, Paper, glob, Fragment) {
                var proto = Paper.prototype, is = Snap.is;
                proto.rect = function(x, y, w, h, rx, ry) {
                    var attr;
                    return null == ry && (ry = rx), is(x, "object") && "[object Object]" == x ? attr = x : null != x && (attr = {
                        x: x,
                        y: y,
                        width: w,
                        height: h
                    }, null != rx && (attr.rx = rx, attr.ry = ry)), this.el("rect", attr);
                }, proto.circle = function(cx, cy, r) {
                    var attr;
                    return is(cx, "object") && "[object Object]" == cx ? attr = cx : null != cx && (attr = {
                        cx: cx,
                        cy: cy,
                        r: r
                    }), this.el("circle", attr);
                };
                var preload = function() {
                    function onerror() {
                        this.parentNode.removeChild(this);
                    }
                    return function(src, f) {
                        var img = glob.doc.createElement("img"), body = glob.doc.body;
                        img.style.cssText = "position:absolute;left:-9999em;top:-9999em", img.onload = function() {
                            f.call(img), img.onload = img.onerror = null, body.removeChild(img);
                        }, img.onerror = onerror, body.appendChild(img), img.src = src;
                    };
                }();
                proto.image = function(src, x, y, width, height) {
                    var el = this.el("image");
                    if (is(src, "object") && "src" in src) el.attr(src); else if (null != src) {
                        var set = {
                            "xlink:href": src,
                            preserveAspectRatio: "none"
                        };
                        null != x && null != y && (set.x = x, set.y = y), null != width && null != height ? (set.width = width, 
                        set.height = height) : preload(src, function() {
                            Snap._.$(el.node, {
                                width: this.offsetWidth,
                                height: this.offsetHeight
                            });
                        }), Snap._.$(el.node, set);
                    }
                    return el;
                }, proto.ellipse = function(cx, cy, rx, ry) {
                    var attr;
                    return is(cx, "object") && "[object Object]" == cx ? attr = cx : null != cx && (attr = {
                        cx: cx,
                        cy: cy,
                        rx: rx,
                        ry: ry
                    }), this.el("ellipse", attr);
                }, proto.path = function(d) {
                    var attr;
                    return is(d, "object") && !is(d, "array") ? attr = d : d && (attr = {
                        d: d
                    }), this.el("path", attr);
                }, proto.group = proto.g = function(first) {
                    var el = this.el("g");
                    return 1 == arguments.length && first && !first.type ? el.attr(first) : arguments.length && el.add(Array.prototype.slice.call(arguments, 0)), 
                    el;
                }, proto.svg = function(x, y, width, height, vbx, vby, vbw, vbh) {
                    var attrs = {};
                    return is(x, "object") && null == y ? attrs = x : (null != x && (attrs.x = x), null != y && (attrs.y = y), 
                    null != width && (attrs.width = width), null != height && (attrs.height = height), 
                    null != vbx && null != vby && null != vbw && null != vbh && (attrs.viewBox = [ vbx, vby, vbw, vbh ])), 
                    this.el("svg", attrs);
                }, proto.mask = function(first) {
                    var el = this.el("mask");
                    return 1 == arguments.length && first && !first.type ? el.attr(first) : arguments.length && el.add(Array.prototype.slice.call(arguments, 0)), 
                    el;
                }, proto.ptrn = function(x, y, width, height, vx, vy, vw, vh) {
                    if (is(x, "object")) var attr = x; else attr = {
                        patternUnits: "userSpaceOnUse"
                    }, x && (attr.x = x), y && (attr.y = y), null != width && (attr.width = width), 
                    null != height && (attr.height = height), null != vx && null != vy && null != vw && null != vh ? attr.viewBox = [ vx, vy, vw, vh ] : attr.viewBox = [ x || 0, y || 0, width || 0, height || 0 ];
                    return this.el("pattern", attr);
                }, proto.use = function(id) {
                    return null != id ? (id instanceof Element && (id.attr("id") || id.attr({
                        id: Snap._.id(id)
                    }), id = id.attr("id")), "#" == String(id).charAt() && (id = id.substring(1)), this.el("use", {
                        "xlink:href": "#" + id
                    })) : Element.prototype.use.call(this);
                }, proto.symbol = function(vx, vy, vw, vh) {
                    var attr = {};
                    return null != vx && null != vy && null != vw && null != vh && (attr.viewBox = [ vx, vy, vw, vh ]), 
                    this.el("symbol", attr);
                }, proto.text = function(x, y, text) {
                    var attr = {};
                    return is(x, "object") ? attr = x : null != x && (attr = {
                        x: x,
                        y: y,
                        text: text || ""
                    }), this.el("text", attr);
                }, proto.line = function(x1, y1, x2, y2) {
                    var attr = {};
                    return is(x1, "object") ? attr = x1 : null != x1 && (attr = {
                        x1: x1,
                        x2: x2,
                        y1: y1,
                        y2: y2
                    }), this.el("line", attr);
                }, proto.polyline = function(points) {
                    arguments.length > 1 && (points = Array.prototype.slice.call(arguments, 0));
                    var attr = {};
                    return is(points, "object") && !is(points, "array") ? attr = points : null != points && (attr = {
                        points: points
                    }), this.el("polyline", attr);
                }, proto.polygon = function(points) {
                    arguments.length > 1 && (points = Array.prototype.slice.call(arguments, 0));
                    var attr = {};
                    return is(points, "object") && !is(points, "array") ? attr = points : null != points && (attr = {
                        points: points
                    }), this.el("polygon", attr);
                }, function() {
                    function Gstops() {
                        return this.selectAll("stop");
                    }
                    function GaddStop(color, offset) {
                        var stop = $("stop"), attr = {
                            offset: +offset + "%"
                        };
                        return color = Snap.color(color), attr["stop-color"] = color.hex, color.opacity < 1 && (attr["stop-opacity"] = color.opacity), 
                        $(stop, attr), this.node.appendChild(stop), this;
                    }
                    function GgetBBox() {
                        if ("linearGradient" == this.type) {
                            var x1 = $(this.node, "x1") || 0, x2 = $(this.node, "x2") || 1, y1 = $(this.node, "y1") || 0, y2 = $(this.node, "y2") || 0;
                            return Snap._.box(x1, y1, math.abs(x2 - x1), math.abs(y2 - y1));
                        }
                        var cx = this.node.cx || .5, cy = this.node.cy || .5, r = this.node.r || 0;
                        return Snap._.box(cx - r, cy - r, 2 * r, 2 * r);
                    }
                    function gradient(defs, str) {
                        function seed(i, end) {
                            for (var step = (end - start) / (i - j), k = j; k < i; k++) stops[k].offset = +(+start + step * (k - j)).toFixed(2);
                            j = i, start = end;
                        }
                        var el, grad = eve("snap.util.grad.parse", null, str).firstDefined();
                        if (!grad) return null;
                        grad.params.unshift(defs), el = "l" == grad.type.toLowerCase() ? gradientLinear.apply(0, grad.params) : gradientRadial.apply(0, grad.params), 
                        grad.type != grad.type.toLowerCase() && $(el.node, {
                            gradientUnits: "userSpaceOnUse"
                        });
                        var stops = grad.stops, len = stops.length, start = 0, j = 0;
                        len--;
                        for (var i = 0; i < len; i++) "offset" in stops[i] && seed(i, stops[i].offset);
                        for (stops[len].offset = stops[len].offset || 100, seed(len, stops[len].offset), 
                        i = 0; i <= len; i++) {
                            var stop = stops[i];
                            el.addStop(stop.color, stop.offset);
                        }
                        return el;
                    }
                    function gradientLinear(defs, x1, y1, x2, y2) {
                        var el = Snap._.make("linearGradient", defs);
                        return el.stops = Gstops, el.addStop = GaddStop, el.getBBox = GgetBBox, null != x1 && $(el.node, {
                            x1: x1,
                            y1: y1,
                            x2: x2,
                            y2: y2
                        }), el;
                    }
                    function gradientRadial(defs, cx, cy, r, fx, fy) {
                        var el = Snap._.make("radialGradient", defs);
                        return el.stops = Gstops, el.addStop = GaddStop, el.getBBox = GgetBBox, null != cx && $(el.node, {
                            cx: cx,
                            cy: cy,
                            r: r
                        }), null != fx && null != fy && $(el.node, {
                            fx: fx,
                            fy: fy
                        }), el;
                    }
                    var $ = Snap._.$;
                    proto.gradient = function(str) {
                        return gradient(this.defs, str);
                    }, proto.gradientLinear = function(x1, y1, x2, y2) {
                        return gradientLinear(this.defs, x1, y1, x2, y2);
                    }, proto.gradientRadial = function(cx, cy, r, fx, fy) {
                        return gradientRadial(this.defs, cx, cy, r, fx, fy);
                    }, proto.toString = function() {
                        var res, doc = this.node.ownerDocument, f = doc.createDocumentFragment(), d = doc.createElement("div"), svg = this.node.cloneNode(!0);
                        return f.appendChild(d), d.appendChild(svg), Snap._.$(svg, {
                            xmlns: "http://www.w3.org/2000/svg"
                        }), res = d.innerHTML, f.removeChild(f.firstChild), res;
                    }, proto.toDataURL = function() {
                        if (window && window.btoa) return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this)));
                    }, proto.clear = function() {
                        for (var next, node = this.node.firstChild; node; ) next = node.nextSibling, "defs" != node.tagName ? node.parentNode.removeChild(node) : proto.clear.call({
                            node: node
                        }), node = next;
                    };
                }();
            }), Snap.plugin(function(Snap, Element, Paper, glob) {
                function paths(ps) {
                    var p = paths.ps = paths.ps || {};
                    return p[ps] ? p[ps].sleep = 100 : p[ps] = {
                        sleep: 100
                    }, setTimeout(function() {
                        for (var key in p) p[has](key) && key != ps && (p[key].sleep--, !p[key].sleep && delete p[key]);
                    }), p[ps];
                }
                function box(x, y, width, height) {
                    return null == x && (x = y = width = height = 0), null == y && (y = x.y, width = x.width, 
                    height = x.height, x = x.x), {
                        x: x,
                        y: y,
                        width: width,
                        w: width,
                        height: height,
                        h: height,
                        x2: x + width,
                        y2: y + height,
                        cx: x + width / 2,
                        cy: y + height / 2,
                        r1: math.min(width, height) / 2,
                        r2: math.max(width, height) / 2,
                        r0: math.sqrt(width * width + height * height) / 2,
                        path: rectPath(x, y, width, height),
                        vb: [ x, y, width, height ].join(" ")
                    };
                }
                function toString() {
                    return this.join(",").replace(p2s, "$1");
                }
                function pathClone(pathArray) {
                    var res = clone(pathArray);
                    return res.toString = toString, res;
                }
                function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
                    return null == length ? bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) : findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, getTotLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
                }
                function getLengthFactory(istotal, subpath) {
                    function O(val) {
                        return +(+val).toFixed(3);
                    }
                    return Snap._.cacher(function(path, length, onlystart) {
                        path instanceof Element && (path = path.attr("d")), path = path2curve(path);
                        for (var x, y, p, l, point, sp = "", subpaths = {}, len = 0, i = 0, ii = path.length; i < ii; i++) {
                            if (p = path[i], "M" == p[0]) x = +p[1], y = +p[2]; else {
                                if (l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]), len + l > length) {
                                    if (subpath && !subpaths.start) {
                                        if (point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len), 
                                        sp += [ "C" + O(point.start.x), O(point.start.y), O(point.m.x), O(point.m.y), O(point.x), O(point.y) ], 
                                        onlystart) return sp;
                                        subpaths.start = sp, sp = [ "M" + O(point.x), O(point.y) + "C" + O(point.n.x), O(point.n.y), O(point.end.x), O(point.end.y), O(p[5]), O(p[6]) ].join(), 
                                        len += l, x = +p[5], y = +p[6];
                                        continue;
                                    }
                                    if (!istotal && !subpath) return point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                                }
                                len += l, x = +p[5], y = +p[6];
                            }
                            sp += p.shift() + p;
                        }
                        return subpaths.end = sp, point = istotal ? len : subpath ? subpaths : findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
                    }, null, Snap._.clone);
                }
                function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
                    var t1 = 1 - t, t13 = pow(t1, 3), t12 = pow(t1, 2), t2 = t * t, t3 = t2 * t, x = t13 * p1x + 3 * t12 * t * c1x + 3 * t1 * t * t * c2x + t3 * p2x, y = t13 * p1y + 3 * t12 * t * c1y + 3 * t1 * t * t * c2y + t3 * p2y, mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x), my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y), nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x), ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y), ax = t1 * p1x + t * c1x, ay = t1 * p1y + t * c1y, cx = t1 * c2x + t * p2x, cy = t1 * c2y + t * p2y, alpha = 90 - 180 * math.atan2(mx - nx, my - ny) / PI;
                    return {
                        x: x,
                        y: y,
                        m: {
                            x: mx,
                            y: my
                        },
                        n: {
                            x: nx,
                            y: ny
                        },
                        start: {
                            x: ax,
                            y: ay
                        },
                        end: {
                            x: cx,
                            y: cy
                        },
                        alpha: alpha
                    };
                }
                function bezierBBox(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
                    Snap.is(p1x, "array") || (p1x = [ p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y ]);
                    var bbox = curveDim.apply(null, p1x);
                    return box(bbox.min.x, bbox.min.y, bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y);
                }
                function isPointInsideBBox(bbox, x, y) {
                    return x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height;
                }
                function isBBoxIntersect(bbox1, bbox2) {
                    return bbox1 = box(bbox1), bbox2 = box(bbox2), isPointInsideBBox(bbox2, bbox1.x, bbox1.y) || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y) || isPointInsideBBox(bbox2, bbox1.x, bbox1.y2) || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2) || isPointInsideBBox(bbox1, bbox2.x, bbox2.y) || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y) || isPointInsideBBox(bbox1, bbox2.x, bbox2.y2) || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2) || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x) && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
                }
                function base3(t, p1, p2, p3, p4) {
                    var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4, t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
                    return t * t2 - 3 * p1 + 3 * p2;
                }
                function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
                    null == z && (z = 1), z = z > 1 ? 1 : z < 0 ? 0 : z;
                    for (var z2 = z / 2, n = 12, Tvalues = [ -.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816 ], Cvalues = [ .2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472 ], sum = 0, i = 0; i < n; i++) {
                        var ct = z2 * Tvalues[i] + z2, xbase = base3(ct, x1, x2, x3, x4), ybase = base3(ct, y1, y2, y3, y4), comb = xbase * xbase + ybase * ybase;
                        sum += Cvalues[i] * math.sqrt(comb);
                    }
                    return z2 * sum;
                }
                function getTotLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
                    if (!(ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll)) {
                        var l, t = 1, step = t / 2, t2 = t - step, e = .01;
                        for (l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2); abs(l - ll) > e; ) step /= 2, 
                        t2 += (l < ll ? 1 : -1) * step, l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
                        return t2;
                    }
                }
                function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
                    if (!(mmax(x1, x2) < mmin(x3, x4) || mmin(x1, x2) > mmax(x3, x4) || mmax(y1, y2) < mmin(y3, y4) || mmin(y1, y2) > mmax(y3, y4))) {
                        var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4), ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4), denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
                        if (denominator) {
                            var px = nx / denominator, py = ny / denominator, px2 = +px.toFixed(2), py2 = +py.toFixed(2);
                            if (!(px2 < +mmin(x1, x2).toFixed(2) || px2 > +mmax(x1, x2).toFixed(2) || px2 < +mmin(x3, x4).toFixed(2) || px2 > +mmax(x3, x4).toFixed(2) || py2 < +mmin(y1, y2).toFixed(2) || py2 > +mmax(y1, y2).toFixed(2) || py2 < +mmin(y3, y4).toFixed(2) || py2 > +mmax(y3, y4).toFixed(2))) return {
                                x: px,
                                y: py
                            };
                        }
                    }
                }
                function interHelper(bez1, bez2, justCount) {
                    var bbox1 = bezierBBox(bez1), bbox2 = bezierBBox(bez2);
                    if (!isBBoxIntersect(bbox1, bbox2)) return justCount ? 0 : [];
                    for (var l1 = bezlen.apply(0, bez1), l2 = bezlen.apply(0, bez2), n1 = ~~(l1 / 8), n2 = ~~(l2 / 8), dots1 = [], dots2 = [], xy = {}, res = justCount ? 0 : [], i = 0; i < n1 + 1; i++) {
                        var p = findDotsAtSegment.apply(0, bez1.concat(i / n1));
                        dots1.push({
                            x: p.x,
                            y: p.y,
                            t: i / n1
                        });
                    }
                    for (i = 0; i < n2 + 1; i++) p = findDotsAtSegment.apply(0, bez2.concat(i / n2)), 
                    dots2.push({
                        x: p.x,
                        y: p.y,
                        t: i / n2
                    });
                    for (i = 0; i < n1; i++) for (var j = 0; j < n2; j++) {
                        var di = dots1[i], di1 = dots1[i + 1], dj = dots2[j], dj1 = dots2[j + 1], ci = abs(di1.x - di.x) < .001 ? "y" : "x", cj = abs(dj1.x - dj.x) < .001 ? "y" : "x", is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
                        if (is) {
                            if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) continue;
                            xy[is.x.toFixed(4)] = is.y.toFixed(4);
                            var t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t), t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
                            t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1 && (justCount ? res++ : res.push({
                                x: is.x,
                                y: is.y,
                                t1: t1,
                                t2: t2
                            }));
                        }
                    }
                    return res;
                }
                function pathIntersection(path1, path2) {
                    return interPathHelper(path1, path2);
                }
                function pathIntersectionNumber(path1, path2) {
                    return interPathHelper(path1, path2, 1);
                }
                function interPathHelper(path1, path2, justCount) {
                    path1 = path2curve(path1), path2 = path2curve(path2);
                    for (var x1, y1, x2, y2, x1m, y1m, x2m, y2m, bez1, bez2, res = justCount ? 0 : [], i = 0, ii = path1.length; i < ii; i++) {
                        var pi = path1[i];
                        if ("M" == pi[0]) x1 = x1m = pi[1], y1 = y1m = pi[2]; else {
                            "C" == pi[0] ? (bez1 = [ x1, y1 ].concat(pi.slice(1)), x1 = bez1[6], y1 = bez1[7]) : (bez1 = [ x1, y1, x1, y1, x1m, y1m, x1m, y1m ], 
                            x1 = x1m, y1 = y1m);
                            for (var j = 0, jj = path2.length; j < jj; j++) {
                                var pj = path2[j];
                                if ("M" == pj[0]) x2 = x2m = pj[1], y2 = y2m = pj[2]; else {
                                    "C" == pj[0] ? (bez2 = [ x2, y2 ].concat(pj.slice(1)), x2 = bez2[6], y2 = bez2[7]) : (bez2 = [ x2, y2, x2, y2, x2m, y2m, x2m, y2m ], 
                                    x2 = x2m, y2 = y2m);
                                    var intr = interHelper(bez1, bez2, justCount);
                                    if (justCount) res += intr; else {
                                        for (var k = 0, kk = intr.length; k < kk; k++) intr[k].segment1 = i, intr[k].segment2 = j, 
                                        intr[k].bez1 = bez1, intr[k].bez2 = bez2;
                                        res = res.concat(intr);
                                    }
                                }
                            }
                        }
                    }
                    return res;
                }
                function isPointInsidePath(path, x, y) {
                    var bbox = pathBBox(path);
                    return isPointInsideBBox(bbox, x, y) && interPathHelper(path, [ [ "M", x, y ], [ "H", bbox.x2 + 10 ] ], 1) % 2 == 1;
                }
                function pathBBox(path) {
                    var pth = paths(path);
                    if (pth.bbox) return clone(pth.bbox);
                    if (!path) return box();
                    path = path2curve(path);
                    for (var p, x = 0, y = 0, X = [], Y = [], i = 0, ii = path.length; i < ii; i++) if (p = path[i], 
                    "M" == p[0]) x = p[1], y = p[2], X.push(x), Y.push(y); else {
                        var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                        X = X.concat(dim.min.x, dim.max.x), Y = Y.concat(dim.min.y, dim.max.y), x = p[5], 
                        y = p[6];
                    }
                    var xmin = mmin.apply(0, X), ymin = mmin.apply(0, Y), xmax = mmax.apply(0, X), ymax = mmax.apply(0, Y), bb = box(xmin, ymin, xmax - xmin, ymax - ymin);
                    return pth.bbox = clone(bb), bb;
                }
                function rectPath(x, y, w, h, r) {
                    if (r) return [ [ "M", +x + +r, y ], [ "l", w - 2 * r, 0 ], [ "a", r, r, 0, 0, 1, r, r ], [ "l", 0, h - 2 * r ], [ "a", r, r, 0, 0, 1, -r, r ], [ "l", 2 * r - w, 0 ], [ "a", r, r, 0, 0, 1, -r, -r ], [ "l", 0, 2 * r - h ], [ "a", r, r, 0, 0, 1, r, -r ], [ "z" ] ];
                    var res = [ [ "M", x, y ], [ "l", w, 0 ], [ "l", 0, h ], [ "l", -w, 0 ], [ "z" ] ];
                    return res.toString = toString, res;
                }
                function ellipsePath(x, y, rx, ry, a) {
                    if (null == a && null == ry && (ry = rx), x = +x, y = +y, rx = +rx, ry = +ry, null != a) var rad = Math.PI / 180, x1 = x + rx * Math.cos(-ry * rad), x2 = x + rx * Math.cos(-a * rad), y1 = y + rx * Math.sin(-ry * rad), y2 = y + rx * Math.sin(-a * rad), res = [ [ "M", x1, y1 ], [ "A", rx, rx, 0, +(a - ry > 180), 0, x2, y2 ] ]; else res = [ [ "M", x, y ], [ "m", 0, -ry ], [ "a", rx, ry, 0, 1, 1, 0, 2 * ry ], [ "a", rx, ry, 0, 1, 1, 0, -2 * ry ], [ "z" ] ];
                    return res.toString = toString, res;
                }
                function pathToRelative(pathArray) {
                    var pth = paths(pathArray), lowerCase = String.prototype.toLowerCase;
                    if (pth.rel) return pathClone(pth.rel);
                    Snap.is(pathArray, "array") && Snap.is(pathArray && pathArray[0], "array") || (pathArray = Snap.parsePathString(pathArray));
                    var res = [], x = 0, y = 0, mx = 0, my = 0, start = 0;
                    "M" == pathArray[0][0] && (x = pathArray[0][1], y = pathArray[0][2], mx = x, my = y, 
                    start++, res.push([ "M", x, y ]));
                    for (var i = start, ii = pathArray.length; i < ii; i++) {
                        var r = res[i] = [], pa = pathArray[i];
                        if (pa[0] != lowerCase.call(pa[0])) switch (r[0] = lowerCase.call(pa[0]), r[0]) {
                          case "a":
                            r[1] = pa[1], r[2] = pa[2], r[3] = pa[3], r[4] = pa[4], r[5] = pa[5], r[6] = +(pa[6] - x).toFixed(3), 
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;

                          case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;

                          case "m":
                            mx = pa[1], my = pa[2];

                          default:
                            for (var j = 1, jj = pa.length; j < jj; j++) r[j] = +(pa[j] - (j % 2 ? x : y)).toFixed(3);
                        } else {
                            r = res[i] = [], "m" == pa[0] && (mx = pa[1] + x, my = pa[2] + y);
                            for (var k = 0, kk = pa.length; k < kk; k++) res[i][k] = pa[k];
                        }
                        var len = res[i].length;
                        switch (res[i][0]) {
                          case "z":
                            x = mx, y = my;
                            break;

                          case "h":
                            x += +res[i][len - 1];
                            break;

                          case "v":
                            y += +res[i][len - 1];
                            break;

                          default:
                            x += +res[i][len - 2], y += +res[i][len - 1];
                        }
                    }
                    return res.toString = toString, pth.rel = pathClone(res), res;
                }
                function pathToAbsolute(pathArray) {
                    var pth = paths(pathArray);
                    if (pth.abs) return pathClone(pth.abs);
                    if (is(pathArray, "array") && is(pathArray && pathArray[0], "array") || (pathArray = Snap.parsePathString(pathArray)), 
                    !pathArray || !pathArray.length) return [ [ "M", 0, 0 ] ];
                    var pa0, res = [], x = 0, y = 0, mx = 0, my = 0, start = 0;
                    "M" == pathArray[0][0] && (x = +pathArray[0][1], y = +pathArray[0][2], mx = x, my = y, 
                    start++, res[0] = [ "M", x, y ]);
                    for (var r, pa, crz = 3 == pathArray.length && "M" == pathArray[0][0] && "R" == pathArray[1][0].toUpperCase() && "Z" == pathArray[2][0].toUpperCase(), i = start, ii = pathArray.length; i < ii; i++) {
                        if (res.push(r = []), pa = pathArray[i], pa0 = pa[0], pa0 != pa0.toUpperCase()) switch (r[0] = pa0.toUpperCase(), 
                        r[0]) {
                          case "A":
                            r[1] = pa[1], r[2] = pa[2], r[3] = pa[3], r[4] = pa[4], r[5] = pa[5], r[6] = +pa[6] + x, 
                            r[7] = +pa[7] + y;
                            break;

                          case "V":
                            r[1] = +pa[1] + y;
                            break;

                          case "H":
                            r[1] = +pa[1] + x;
                            break;

                          case "R":
                            for (var dots = [ x, y ].concat(pa.slice(1)), j = 2, jj = dots.length; j < jj; j++) dots[j] = +dots[j] + x, 
                            dots[++j] = +dots[j] + y;
                            res.pop(), res = res.concat(catmullRom2bezier(dots, crz));
                            break;

                          case "O":
                            res.pop(), dots = ellipsePath(x, y, pa[1], pa[2]), dots.push(dots[0]), res = res.concat(dots);
                            break;

                          case "U":
                            res.pop(), res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3])), r = [ "U" ].concat(res[res.length - 1].slice(-2));
                            break;

                          case "M":
                            mx = +pa[1] + x, my = +pa[2] + y;

                          default:
                            for (j = 1, jj = pa.length; j < jj; j++) r[j] = +pa[j] + (j % 2 ? x : y);
                        } else if ("R" == pa0) dots = [ x, y ].concat(pa.slice(1)), res.pop(), res = res.concat(catmullRom2bezier(dots, crz)), 
                        r = [ "R" ].concat(pa.slice(-2)); else if ("O" == pa0) res.pop(), dots = ellipsePath(x, y, pa[1], pa[2]), 
                        dots.push(dots[0]), res = res.concat(dots); else if ("U" == pa0) res.pop(), res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3])), 
                        r = [ "U" ].concat(res[res.length - 1].slice(-2)); else for (var k = 0, kk = pa.length; k < kk; k++) r[k] = pa[k];
                        if (pa0 = pa0.toUpperCase(), "O" != pa0) switch (r[0]) {
                          case "Z":
                            x = +mx, y = +my;
                            break;

                          case "H":
                            x = r[1];
                            break;

                          case "V":
                            y = r[1];
                            break;

                          case "M":
                            mx = r[r.length - 2], my = r[r.length - 1];

                          default:
                            x = r[r.length - 2], y = r[r.length - 1];
                        }
                    }
                    return res.toString = toString, pth.abs = pathClone(res), res;
                }
                function l2c(x1, y1, x2, y2) {
                    return [ x1, y1, x2, y2, x2, y2 ];
                }
                function q2c(x1, y1, ax, ay, x2, y2) {
                    var _13 = 1 / 3, _23 = 2 / 3;
                    return [ _13 * x1 + _23 * ax, _13 * y1 + _23 * ay, _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2 ];
                }
                function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
                    var xy, _120 = 120 * PI / 180, rad = PI / 180 * (+angle || 0), res = [], rotate = Snap._.cacher(function(x, y, rad) {
                        var X = x * math.cos(rad) - y * math.sin(rad), Y = x * math.sin(rad) + y * math.cos(rad);
                        return {
                            x: X,
                            y: Y
                        };
                    });
                    if (recursive) f1 = recursive[0], f2 = recursive[1], cx = recursive[2], cy = recursive[3]; else {
                        xy = rotate(x1, y1, -rad), x1 = xy.x, y1 = xy.y, xy = rotate(x2, y2, -rad), x2 = xy.x, 
                        y2 = xy.y;
                        var x = (math.cos(PI / 180 * angle), math.sin(PI / 180 * angle), (x1 - x2) / 2), y = (y1 - y2) / 2, h = x * x / (rx * rx) + y * y / (ry * ry);
                        h > 1 && (h = math.sqrt(h), rx = h * rx, ry = h * ry);
                        var rx2 = rx * rx, ry2 = ry * ry, k = (large_arc_flag == sweep_flag ? -1 : 1) * math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))), cx = k * rx * y / ry + (x1 + x2) / 2, cy = k * -ry * x / rx + (y1 + y2) / 2, f1 = math.asin(((y1 - cy) / ry).toFixed(9)), f2 = math.asin(((y2 - cy) / ry).toFixed(9));
                        f1 = x1 < cx ? PI - f1 : f1, f2 = x2 < cx ? PI - f2 : f2, f1 < 0 && (f1 = 2 * PI + f1), 
                        f2 < 0 && (f2 = 2 * PI + f2), sweep_flag && f1 > f2 && (f1 -= 2 * PI), !sweep_flag && f2 > f1 && (f2 -= 2 * PI);
                    }
                    var df = f2 - f1;
                    if (abs(df) > _120) {
                        var f2old = f2, x2old = x2, y2old = y2;
                        f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1), x2 = cx + rx * math.cos(f2), 
                        y2 = cy + ry * math.sin(f2), res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [ f2, f2old, cx, cy ]);
                    }
                    df = f2 - f1;
                    var c1 = math.cos(f1), s1 = math.sin(f1), c2 = math.cos(f2), s2 = math.sin(f2), t = math.tan(df / 4), hx = 4 / 3 * rx * t, hy = 4 / 3 * ry * t, m1 = [ x1, y1 ], m2 = [ x1 + hx * s1, y1 - hy * c1 ], m3 = [ x2 + hx * s2, y2 - hy * c2 ], m4 = [ x2, y2 ];
                    if (m2[0] = 2 * m1[0] - m2[0], m2[1] = 2 * m1[1] - m2[1], recursive) return [ m2, m3, m4 ].concat(res);
                    res = [ m2, m3, m4 ].concat(res).join().split(",");
                    for (var newres = [], i = 0, ii = res.length; i < ii; i++) newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                    return newres;
                }
                function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
                    for (var a, b, c, t, t1, t2, b2ac, sqrtb2ac, tvalues = [], bounds = [ [], [] ], i = 0; i < 2; ++i) if (0 == i ? (b = 6 * x0 - 12 * x1 + 6 * x2, 
                    a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3, c = 3 * x1 - 3 * x0) : (b = 6 * y0 - 12 * y1 + 6 * y2, 
                    a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3, c = 3 * y1 - 3 * y0), abs(a) < 1e-12) {
                        if (abs(b) < 1e-12) continue;
                        t = -c / b, 0 < t && t < 1 && tvalues.push(t);
                    } else b2ac = b * b - 4 * c * a, sqrtb2ac = math.sqrt(b2ac), b2ac < 0 || (t1 = (-b + sqrtb2ac) / (2 * a), 
                    0 < t1 && t1 < 1 && tvalues.push(t1), t2 = (-b - sqrtb2ac) / (2 * a), 0 < t2 && t2 < 1 && tvalues.push(t2));
                    for (var mt, j = tvalues.length, jlen = j; j--; ) t = tvalues[j], mt = 1 - t, bounds[0][j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3, 
                    bounds[1][j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
                    return bounds[0][jlen] = x0, bounds[1][jlen] = y0, bounds[0][jlen + 1] = x3, bounds[1][jlen + 1] = y3, 
                    bounds[0].length = bounds[1].length = jlen + 2, {
                        min: {
                            x: mmin.apply(0, bounds[0]),
                            y: mmin.apply(0, bounds[1])
                        },
                        max: {
                            x: mmax.apply(0, bounds[0]),
                            y: mmax.apply(0, bounds[1])
                        }
                    };
                }
                function path2curve(path, path2) {
                    var pth = !path2 && paths(path);
                    if (!path2 && pth.curve) return pathClone(pth.curve);
                    for (var p = pathToAbsolute(path), p2 = path2 && pathToAbsolute(path2), attrs = {
                        x: 0,
                        y: 0,
                        bx: 0,
                        by: 0,
                        X: 0,
                        Y: 0,
                        qx: null,
                        qy: null
                    }, attrs2 = {
                        x: 0,
                        y: 0,
                        bx: 0,
                        by: 0,
                        X: 0,
                        Y: 0,
                        qx: null,
                        qy: null
                    }, processPath = (function(path, d, pcom) {
                        var nx, ny;
                        if (!path) return [ "C", d.x, d.y, d.x, d.y, d.x, d.y ];
                        switch (!(path[0] in {
                            T: 1,
                            Q: 1
                        }) && (d.qx = d.qy = null), path[0]) {
                          case "M":
                            d.X = path[1], d.Y = path[2];
                            break;

                          case "A":
                            path = [ "C" ].concat(a2c.apply(0, [ d.x, d.y ].concat(path.slice(1))));
                            break;

                          case "S":
                            "C" == pcom || "S" == pcom ? (nx = 2 * d.x - d.bx, ny = 2 * d.y - d.by) : (nx = d.x, 
                            ny = d.y), path = [ "C", nx, ny ].concat(path.slice(1));
                            break;

                          case "T":
                            "Q" == pcom || "T" == pcom ? (d.qx = 2 * d.x - d.qx, d.qy = 2 * d.y - d.qy) : (d.qx = d.x, 
                            d.qy = d.y), path = [ "C" ].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;

                          case "Q":
                            d.qx = path[1], d.qy = path[2], path = [ "C" ].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;

                          case "L":
                            path = [ "C" ].concat(l2c(d.x, d.y, path[1], path[2]));
                            break;

                          case "H":
                            path = [ "C" ].concat(l2c(d.x, d.y, path[1], d.y));
                            break;

                          case "V":
                            path = [ "C" ].concat(l2c(d.x, d.y, d.x, path[1]));
                            break;

                          case "Z":
                            path = [ "C" ].concat(l2c(d.x, d.y, d.X, d.Y));
                        }
                        return path;
                    }), fixArc = function(pp, i) {
                        if (pp[i].length > 7) {
                            pp[i].shift();
                            for (var pi = pp[i]; pi.length; ) pcoms1[i] = "A", p2 && (pcoms2[i] = "A"), pp.splice(i++, 0, [ "C" ].concat(pi.splice(0, 6)));
                            pp.splice(i, 1), ii = mmax(p.length, p2 && p2.length || 0);
                        }
                    }, fixM = function(path1, path2, a1, a2, i) {
                        path1 && path2 && "M" == path1[i][0] && "M" != path2[i][0] && (path2.splice(i, 0, [ "M", a2.x, a2.y ]), 
                        a1.bx = 0, a1.by = 0, a1.x = path1[i][1], a1.y = path1[i][2], ii = mmax(p.length, p2 && p2.length || 0));
                    }, pcoms1 = [], pcoms2 = [], pfirst = "", pcom = "", i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
                        p[i] && (pfirst = p[i][0]), "C" != pfirst && (pcoms1[i] = pfirst, i && (pcom = pcoms1[i - 1])), 
                        p[i] = processPath(p[i], attrs, pcom), "A" != pcoms1[i] && "C" == pfirst && (pcoms1[i] = "C"), 
                        fixArc(p, i), p2 && (p2[i] && (pfirst = p2[i][0]), "C" != pfirst && (pcoms2[i] = pfirst, 
                        i && (pcom = pcoms2[i - 1])), p2[i] = processPath(p2[i], attrs2, pcom), "A" != pcoms2[i] && "C" == pfirst && (pcoms2[i] = "C"), 
                        fixArc(p2, i)), fixM(p, p2, attrs, attrs2, i), fixM(p2, p, attrs2, attrs, i);
                        var seg = p[i], seg2 = p2 && p2[i], seglen = seg.length, seg2len = p2 && seg2.length;
                        attrs.x = seg[seglen - 2], attrs.y = seg[seglen - 1], attrs.bx = toFloat(seg[seglen - 4]) || attrs.x, 
                        attrs.by = toFloat(seg[seglen - 3]) || attrs.y, attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x), 
                        attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y), attrs2.x = p2 && seg2[seg2len - 2], 
                        attrs2.y = p2 && seg2[seg2len - 1];
                    }
                    return p2 || (pth.curve = pathClone(p)), p2 ? [ p, p2 ] : p;
                }
                function mapPath(path, matrix) {
                    if (!matrix) return path;
                    var x, y, i, j, ii, jj, pathi;
                    for (path = path2curve(path), i = 0, ii = path.length; i < ii; i++) for (pathi = path[i], 
                    j = 1, jj = pathi.length; j < jj; j += 2) x = matrix.x(pathi[j], pathi[j + 1]), 
                    y = matrix.y(pathi[j], pathi[j + 1]), pathi[j] = x, pathi[j + 1] = y;
                    return path;
                }
                function catmullRom2bezier(crp, z) {
                    for (var d = [], i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
                        var p = [ {
                            x: +crp[i - 2],
                            y: +crp[i - 1]
                        }, {
                            x: +crp[i],
                            y: +crp[i + 1]
                        }, {
                            x: +crp[i + 2],
                            y: +crp[i + 3]
                        }, {
                            x: +crp[i + 4],
                            y: +crp[i + 5]
                        } ];
                        z ? i ? iLen - 4 == i ? p[3] = {
                            x: +crp[0],
                            y: +crp[1]
                        } : iLen - 2 == i && (p[2] = {
                            x: +crp[0],
                            y: +crp[1]
                        }, p[3] = {
                            x: +crp[2],
                            y: +crp[3]
                        }) : p[0] = {
                            x: +crp[iLen - 2],
                            y: +crp[iLen - 1]
                        } : iLen - 4 == i ? p[3] = p[2] : i || (p[0] = {
                            x: +crp[i],
                            y: +crp[i + 1]
                        }), d.push([ "C", (-p[0].x + 6 * p[1].x + p[2].x) / 6, (-p[0].y + 6 * p[1].y + p[2].y) / 6, (p[1].x + 6 * p[2].x - p[3].x) / 6, (p[1].y + 6 * p[2].y - p[3].y) / 6, p[2].x, p[2].y ]);
                    }
                    return d;
                }
                var elproto = Element.prototype, is = Snap.is, clone = Snap._.clone, has = "hasOwnProperty", p2s = /,?([a-z]),?/gi, toFloat = parseFloat, math = Math, PI = math.PI, mmin = math.min, mmax = math.max, pow = math.pow, abs = math.abs, getTotalLength = getLengthFactory(1), getPointAtLength = getLengthFactory(), getSubpathsAtLength = getLengthFactory(0, 1), unit2px = Snap._unit2px, getPath = {
                    path: function(el) {
                        return el.attr("path");
                    },
                    circle: function(el) {
                        var attr = unit2px(el);
                        return ellipsePath(attr.cx, attr.cy, attr.r);
                    },
                    ellipse: function(el) {
                        var attr = unit2px(el);
                        return ellipsePath(attr.cx || 0, attr.cy || 0, attr.rx, attr.ry);
                    },
                    rect: function(el) {
                        var attr = unit2px(el);
                        return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height, attr.rx, attr.ry);
                    },
                    image: function(el) {
                        var attr = unit2px(el);
                        return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height);
                    },
                    line: function(el) {
                        return "M" + [ el.attr("x1") || 0, el.attr("y1") || 0, el.attr("x2"), el.attr("y2") ];
                    },
                    polyline: function(el) {
                        return "M" + el.attr("points");
                    },
                    polygon: function(el) {
                        return "M" + el.attr("points") + "z";
                    },
                    deflt: function(el) {
                        var bbox = el.node.getBBox();
                        return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
                    }
                };
                Snap.path = paths, Snap.path.getTotalLength = getTotalLength, Snap.path.getPointAtLength = getPointAtLength, 
                Snap.path.getSubpath = function(path, from, to) {
                    if (this.getTotalLength(path) - to < 1e-6) return getSubpathsAtLength(path, from).end;
                    var a = getSubpathsAtLength(path, to, 1);
                    return from ? getSubpathsAtLength(a, from).end : a;
                }, elproto.getTotalLength = function() {
                    if (this.node.getTotalLength) return this.node.getTotalLength();
                }, elproto.getPointAtLength = function(length) {
                    return getPointAtLength(this.attr("d"), length);
                }, elproto.getSubpath = function(from, to) {
                    return Snap.path.getSubpath(this.attr("d"), from, to);
                }, Snap._.box = box, Snap.path.findDotsAtSegment = findDotsAtSegment, Snap.path.bezierBBox = bezierBBox, 
                Snap.path.isPointInsideBBox = isPointInsideBBox, Snap.closest = function(x, y, X, Y) {
                    for (var r = 100, b = box(x - r / 2, y - r / 2, r, r), inside = [], getter = X[0].hasOwnProperty("x") ? function(i) {
                        return {
                            x: X[i].x,
                            y: X[i].y
                        };
                    } : function(i) {
                        return {
                            x: X[i],
                            y: Y[i]
                        };
                    }, found = 0; r <= 1e6 && !found; ) {
                        for (var i = 0, ii = X.length; i < ii; i++) {
                            var xy = getter(i);
                            if (isPointInsideBBox(b, xy.x, xy.y)) {
                                found++, inside.push(xy);
                                break;
                            }
                        }
                        found || (r *= 2, b = box(x - r / 2, y - r / 2, r, r));
                    }
                    if (1e6 != r) {
                        var res, len = 1 / 0;
                        for (i = 0, ii = inside.length; i < ii; i++) {
                            var l = Snap.len(x, y, inside[i].x, inside[i].y);
                            len > l && (len = l, inside[i].len = l, res = inside[i]);
                        }
                        return res;
                    }
                }, Snap.path.isBBoxIntersect = isBBoxIntersect, Snap.path.intersection = pathIntersection, 
                Snap.path.intersectionNumber = pathIntersectionNumber, Snap.path.isPointInside = isPointInsidePath, 
                Snap.path.getBBox = pathBBox, Snap.path.get = getPath, Snap.path.toRelative = pathToRelative, 
                Snap.path.toAbsolute = pathToAbsolute, Snap.path.toCubic = path2curve, Snap.path.map = mapPath, 
                Snap.path.toString = toString, Snap.path.clone = pathClone;
            }), Snap.plugin(function(Snap, Element, Paper, glob) {
                var mmax = Math.max, mmin = Math.min, Set = function(items) {
                    if (this.items = [], this.bindings = {}, this.length = 0, this.type = "set", items) for (var i = 0, ii = items.length; i < ii; i++) items[i] && (this[this.items.length] = this.items[this.items.length] = items[i], 
                    this.length++);
                }, setproto = Set.prototype;
                setproto.push = function() {
                    for (var item, len, i = 0, ii = arguments.length; i < ii; i++) item = arguments[i], 
                    item && (len = this.items.length, this[len] = this.items[len] = item, this.length++);
                    return this;
                }, setproto.pop = function() {
                    return this.length && delete this[this.length--], this.items.pop();
                }, setproto.forEach = function(callback, thisArg) {
                    for (var i = 0, ii = this.items.length; i < ii; i++) if (callback.call(thisArg, this.items[i], i) === !1) return this;
                    return this;
                }, setproto.animate = function(attrs, ms, easing, callback) {
                    "function" != typeof easing || easing.length || (callback = easing, easing = mina.linear), 
                    attrs instanceof Snap._.Animation && (callback = attrs.callback, easing = attrs.easing, 
                    ms = easing.dur, attrs = attrs.attr);
                    var args = arguments;
                    if (Snap.is(attrs, "array") && Snap.is(args[args.length - 1], "array")) var each = !0;
                    var begin, handler = function() {
                        begin ? this.b = begin : begin = this.b;
                    }, cb = 0, set = this, callbacker = callback && function() {
                        ++cb == set.length && callback.call(this);
                    };
                    return this.forEach(function(el, i) {
                        eve.once("snap.animcreated." + el.id, handler), each ? args[i] && el.animate.apply(el, args[i]) : el.animate(attrs, ms, easing, callbacker);
                    });
                }, setproto.remove = function() {
                    for (;this.length; ) this.pop().remove();
                    return this;
                }, setproto.bind = function(attr, a, b) {
                    var data = {};
                    if ("function" == typeof a) this.bindings[attr] = a; else {
                        var aname = b || attr;
                        this.bindings[attr] = function(v) {
                            data[aname] = v, a.attr(data);
                        };
                    }
                    return this;
                }, setproto.attr = function(value) {
                    var unbound = {};
                    for (var k in value) this.bindings[k] ? this.bindings[k](value[k]) : unbound[k] = value[k];
                    for (var i = 0, ii = this.items.length; i < ii; i++) this.items[i].attr(unbound);
                    return this;
                }, setproto.clear = function() {
                    for (;this.length; ) this.pop();
                }, setproto.splice = function(index, count, insertion) {
                    index = index < 0 ? mmax(this.length + index, 0) : index, count = mmax(0, mmin(this.length - index, count));
                    var i, tail = [], todel = [], args = [];
                    for (i = 2; i < arguments.length; i++) args.push(arguments[i]);
                    for (i = 0; i < count; i++) todel.push(this[index + i]);
                    for (;i < this.length - index; i++) tail.push(this[index + i]);
                    var arglen = args.length;
                    for (i = 0; i < arglen + tail.length; i++) this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
                    for (i = this.items.length = this.length -= count - arglen; this[i]; ) delete this[i++];
                    return new Set(todel);
                }, setproto.exclude = function(el) {
                    for (var i = 0, ii = this.length; i < ii; i++) if (this[i] == el) return this.splice(i, 1), 
                    !0;
                    return !1;
                }, setproto.insertAfter = function(el) {
                    for (var i = this.items.length; i--; ) this.items[i].insertAfter(el);
                    return this;
                }, setproto.getBBox = function() {
                    for (var x = [], y = [], x2 = [], y2 = [], i = this.items.length; i--; ) if (!this.items[i].removed) {
                        var box = this.items[i].getBBox();
                        x.push(box.x), y.push(box.y), x2.push(box.x + box.width), y2.push(box.y + box.height);
                    }
                    return x = mmin.apply(0, x), y = mmin.apply(0, y), x2 = mmax.apply(0, x2), y2 = mmax.apply(0, y2), 
                    {
                        x: x,
                        y: y,
                        x2: x2,
                        y2: y2,
                        width: x2 - x,
                        height: y2 - y,
                        cx: x + (x2 - x) / 2,
                        cy: y + (y2 - y) / 2
                    };
                }, setproto.clone = function(s) {
                    s = new Set();
                    for (var i = 0, ii = this.items.length; i < ii; i++) s.push(this.items[i].clone());
                    return s;
                }, setproto.toString = function() {
                    return "Snap‘s set";
                }, setproto.type = "set", Snap.Set = Set, Snap.set = function() {
                    var set = new Set();
                    return arguments.length && set.push.apply(set, Array.prototype.slice.call(arguments, 0)), 
                    set;
                };
            }), Snap.plugin(function(Snap, Element, Paper, glob) {
                function getEmpty(item) {
                    var l = item[0];
                    switch (l.toLowerCase()) {
                      case "t":
                        return [ l, 0, 0 ];

                      case "m":
                        return [ l, 1, 0, 0, 1, 0, 0 ];

                      case "r":
                        return 4 == item.length ? [ l, 0, item[2], item[3] ] : [ l, 0 ];

                      case "s":
                        return 5 == item.length ? [ l, 1, 1, item[3], item[4] ] : 3 == item.length ? [ l, 1, 1 ] : [ l, 1 ];
                    }
                }
                function equaliseTransform(t1, t2, getBBox) {
                    t2 = Str(t2).replace(/\.{3}|\u2026/g, t1), t1 = Snap.parseTransformString(t1) || [], 
                    t2 = Snap.parseTransformString(t2) || [];
                    for (var j, jj, tt1, tt2, maxlength = Math.max(t1.length, t2.length), from = [], to = [], i = 0; i < maxlength; i++) {
                        if (tt1 = t1[i] || getEmpty(t2[i]), tt2 = t2[i] || getEmpty(tt1), tt1[0] != tt2[0] || "r" == tt1[0].toLowerCase() && (tt1[2] != tt2[2] || tt1[3] != tt2[3]) || "s" == tt1[0].toLowerCase() && (tt1[3] != tt2[3] || tt1[4] != tt2[4])) {
                            t1 = Snap._.transform2matrix(t1, getBBox()), t2 = Snap._.transform2matrix(t2, getBBox()), 
                            from = [ [ "m", t1.a, t1.b, t1.c, t1.d, t1.e, t1.f ] ], to = [ [ "m", t2.a, t2.b, t2.c, t2.d, t2.e, t2.f ] ];
                            break;
                        }
                        for (from[i] = [], to[i] = [], j = 0, jj = Math.max(tt1.length, tt2.length); j < jj; j++) j in tt1 && (from[i][j] = tt1[j]), 
                        j in tt2 && (to[i][j] = tt2[j]);
                    }
                    return {
                        from: path2array(from),
                        to: path2array(to),
                        f: getPath(from)
                    };
                }
                function getNumber(val) {
                    return val;
                }
                function getUnit(unit) {
                    return function(val) {
                        return +val.toFixed(3) + unit;
                    };
                }
                function getViewBox(val) {
                    return val.join(" ");
                }
                function getColour(clr) {
                    return Snap.rgb(clr[0], clr[1], clr[2]);
                }
                function getPath(path) {
                    var i, ii, j, jj, out, a, k = 0, b = [];
                    for (i = 0, ii = path.length; i < ii; i++) {
                        for (out = "[", a = [ '"' + path[i][0] + '"' ], j = 1, jj = path[i].length; j < jj; j++) a[j] = "val[" + k++ + "]";
                        out += a + "]", b[i] = out;
                    }
                    return Function("val", "return Snap.path.toString.call([" + b + "])");
                }
                function path2array(path) {
                    for (var out = [], i = 0, ii = path.length; i < ii; i++) for (var j = 1, jj = path[i].length; j < jj; j++) out.push(path[i][j]);
                    return out;
                }
                function isNumeric(obj) {
                    return isFinite(parseFloat(obj));
                }
                function arrayEqual(arr1, arr2) {
                    return !(!Snap.is(arr1, "array") || !Snap.is(arr2, "array")) && arr1.toString() == arr2.toString();
                }
                var names = {}, reUnit = /[a-z]+$/i, Str = String;
                names.stroke = names.fill = "colour", Element.prototype.equal = function(name, b) {
                    return eve("snap.util.equal", this, name, b).firstDefined();
                }, eve.on("snap.util.equal", function(name, b) {
                    var A, B, a = Str(this.attr(name) || ""), el = this;
                    if (isNumeric(a) && isNumeric(b)) return {
                        from: parseFloat(a),
                        to: parseFloat(b),
                        f: getNumber
                    };
                    if ("colour" == names[name]) return A = Snap.color(a), B = Snap.color(b), {
                        from: [ A.r, A.g, A.b, A.opacity ],
                        to: [ B.r, B.g, B.b, B.opacity ],
                        f: getColour
                    };
                    if ("viewBox" == name) return A = this.attr(name).vb.split(" ").map(Number), B = b.split(" ").map(Number), 
                    {
                        from: A,
                        to: B,
                        f: getViewBox
                    };
                    if ("transform" == name || "gradientTransform" == name || "patternTransform" == name) return b instanceof Snap.Matrix && (b = b.toTransformString()), 
                    Snap._.rgTransform.test(b) || (b = Snap._.svgTransform2string(b)), equaliseTransform(a, b, function() {
                        return el.getBBox(1);
                    });
                    if ("d" == name || "path" == name) return A = Snap.path.toCubic(a, b), {
                        from: path2array(A[0]),
                        to: path2array(A[1]),
                        f: getPath(A[0])
                    };
                    if ("points" == name) return A = Str(a).split(Snap._.separator), B = Str(b).split(Snap._.separator), 
                    {
                        from: A,
                        to: B,
                        f: function(val) {
                            return val;
                        }
                    };
                    var aUnit = a.match(reUnit), bUnit = Str(b).match(reUnit);
                    return aUnit && arrayEqual(aUnit, bUnit) ? {
                        from: parseFloat(a),
                        to: parseFloat(b),
                        f: getUnit(aUnit)
                    } : {
                        from: this.asPX(name),
                        to: this.asPX(name, b),
                        f: getNumber
                    };
                });
            }), Snap.plugin(function(Snap, Element, Paper, glob) {
                for (var elproto = Element.prototype, has = "hasOwnProperty", supportsTouch = ("createTouch" in glob.doc), events = [ "click", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "touchstart", "touchmove", "touchend", "touchcancel" ], touchMap = {
                    mousedown: "touchstart",
                    mousemove: "touchmove",
                    mouseup: "touchend"
                }, getScroll = (function(xy, el) {
                    var name = "y" == xy ? "scrollTop" : "scrollLeft", doc = el && el.node ? el.node.ownerDocument : glob.doc;
                    return doc[name in doc.documentElement ? "documentElement" : "body"][name];
                }), preventTouch = function() {
                    return this.originalEvent.preventDefault();
                }, stopTouch = function() {
                    return this.originalEvent.stopPropagation();
                }, addEvent = function(obj, type, fn, element) {
                    var realName = supportsTouch && touchMap[type] ? touchMap[type] : type, f = function(e) {
                        var scrollY = getScroll("y", element), scrollX = getScroll("x", element);
                        if (supportsTouch && touchMap[has](type)) for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) if (e.targetTouches[i].target == obj || obj.contains(e.targetTouches[i].target)) {
                            var olde = e;
                            e = e.targetTouches[i], e.originalEvent = olde, e.preventDefault = preventTouch, 
                            e.stopPropagation = stopTouch;
                            break;
                        }
                        var x = e.clientX + scrollX, y = e.clientY + scrollY;
                        return fn.call(element, e, x, y);
                    };
                    return type !== realName && obj.addEventListener(type, f, !1), obj.addEventListener(realName, f, !1), 
                    function() {
                        return type !== realName && obj.removeEventListener(type, f, !1), obj.removeEventListener(realName, f, !1), 
                        !0;
                    };
                }, drag = [], dragMove = function(e) {
                    for (var dragi, x = e.clientX, y = e.clientY, scrollY = getScroll("y"), scrollX = getScroll("x"), j = drag.length; j--; ) {
                        if (dragi = drag[j], supportsTouch) {
                            for (var touch, i = e.touches && e.touches.length; i--; ) if (touch = e.touches[i], 
                            touch.identifier == dragi.el._drag.id || dragi.el.node.contains(touch.target)) {
                                x = touch.clientX, y = touch.clientY, (e.originalEvent ? e.originalEvent : e).preventDefault();
                                break;
                            }
                        } else e.preventDefault();
                        var node = dragi.el.node;
                        node.nextSibling, node.parentNode, node.style.display;
                        x += scrollX, y += scrollY, eve("snap.drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
                    }
                }, dragUp = function dragUp(e) {
                    Snap.unmousemove(dragMove).unmouseup(dragUp);
                    for (var dragi, i = drag.length; i--; ) dragi = drag[i], dragi.el._drag = {}, eve("snap.drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e), 
                    eve.off("snap.drag.*." + dragi.el.id);
                    drag = [];
                }, i = events.length; i--; ) !function(eventName) {
                    Snap[eventName] = elproto[eventName] = function(fn, scope) {
                        if (Snap.is(fn, "function")) this.events = this.events || [], this.events.push({
                            name: eventName,
                            f: fn,
                            unbind: addEvent(this.node || document, eventName, fn, scope || this)
                        }); else for (var i = 0, ii = this.events.length; i < ii; i++) if (this.events[i].name == eventName) try {
                            this.events[i].f.call(this);
                        } catch (e) {}
                        return this;
                    }, Snap["un" + eventName] = elproto["un" + eventName] = function(fn) {
                        for (var events = this.events || [], l = events.length; l--; ) if (events[l].name == eventName && (events[l].f == fn || !fn)) return events[l].unbind(), 
                        events.splice(l, 1), !events.length && delete this.events, this;
                        return this;
                    };
                }(events[i]);
                elproto.hover = function(f_in, f_out, scope_in, scope_out) {
                    return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
                }, elproto.unhover = function(f_in, f_out) {
                    return this.unmouseover(f_in).unmouseout(f_out);
                };
                var draggable = [];
                elproto.drag = function(onmove, onstart, onend, move_scope, start_scope, end_scope) {
                    function start(e, x, y) {
                        (e.originalEvent || e).preventDefault(), el._drag.x = x, el._drag.y = y, el._drag.id = e.identifier, 
                        !drag.length && Snap.mousemove(dragMove).mouseup(dragUp), drag.push({
                            el: el,
                            move_scope: move_scope,
                            start_scope: start_scope,
                            end_scope: end_scope
                        }), onstart && eve.on("snap.drag.start." + el.id, onstart), onmove && eve.on("snap.drag.move." + el.id, onmove), 
                        onend && eve.on("snap.drag.end." + el.id, onend), eve("snap.drag.start." + el.id, start_scope || move_scope || el, x, y, e);
                    }
                    function init(e, x, y) {
                        eve("snap.draginit." + el.id, el, e, x, y);
                    }
                    var el = this;
                    if (!arguments.length) {
                        var origTransform;
                        return el.drag(function(dx, dy) {
                            this.attr({
                                transform: origTransform + (origTransform ? "T" : "t") + [ dx, dy ]
                            });
                        }, function() {
                            origTransform = this.transform().local;
                        });
                    }
                    return eve.on("snap.draginit." + el.id, start), el._drag = {}, draggable.push({
                        el: el,
                        start: start,
                        init: init
                    }), el.mousedown(init), el;
                }, elproto.undrag = function() {
                    for (var i = draggable.length; i--; ) draggable[i].el == this && (this.unmousedown(draggable[i].init), 
                    draggable.splice(i, 1), eve.unbind("snap.drag.*." + this.id), eve.unbind("snap.draginit." + this.id));
                    return !draggable.length && Snap.unmousemove(dragMove).unmouseup(dragUp), this;
                };
            }), Snap.plugin(function(Snap, Element, Paper, glob) {
                var pproto = (Element.prototype, Paper.prototype), rgurl = /^\s*url\((.+)\)/, Str = String, $ = Snap._.$;
                Snap.filter = {}, pproto.filter = function(filstr) {
                    var paper = this;
                    "svg" != paper.type && (paper = paper.paper);
                    var f = Snap.parse(Str(filstr)), id = Snap._.id(), filter = (paper.node.offsetWidth, 
                    paper.node.offsetHeight, $("filter"));
                    return $(filter, {
                        id: id,
                        filterUnits: "userSpaceOnUse"
                    }), filter.appendChild(f.node), paper.defs.appendChild(filter), new Element(filter);
                }, eve.on("snap.util.getattr.filter", function() {
                    eve.stop();
                    var p = $(this.node, "filter");
                    if (p) {
                        var match = Str(p).match(rgurl);
                        return match && Snap.select(match[1]);
                    }
                }), eve.on("snap.util.attr.filter", function(value) {
                    if (value instanceof Element && "filter" == value.type) {
                        eve.stop();
                        var id = value.node.id;
                        id || ($(value.node, {
                            id: value.id
                        }), id = value.id), $(this.node, {
                            filter: Snap.url(id)
                        });
                    }
                    value && "none" != value || (eve.stop(), this.node.removeAttribute("filter"));
                }), Snap.filter.blur = function(x, y) {
                    null == x && (x = 2);
                    var def = null == y ? x : [ x, y ];
                    return Snap.format('<feGaussianBlur stdDeviation="{def}"/>', {
                        def: def
                    });
                }, Snap.filter.blur.toString = function() {
                    return this();
                }, Snap.filter.shadow = function(dx, dy, blur, color, opacity) {
                    return "string" == typeof blur && (color = blur, opacity = color, blur = 4), "string" != typeof color && (opacity = color, 
                    color = "#000"), color = color || "#000", null == blur && (blur = 4), null == opacity && (opacity = 1), 
                    null == dx && (dx = 0, dy = 2), null == dy && (dy = dx), color = Snap.color(color), 
                    Snap.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>', {
                        color: color,
                        dx: dx,
                        dy: dy,
                        blur: blur,
                        opacity: opacity
                    });
                }, Snap.filter.shadow.toString = function() {
                    return this();
                }, Snap.filter.grayscale = function(amount) {
                    return null == amount && (amount = 1), Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
                        a: .2126 + .7874 * (1 - amount),
                        b: .7152 - .7152 * (1 - amount),
                        c: .0722 - .0722 * (1 - amount),
                        d: .2126 - .2126 * (1 - amount),
                        e: .7152 + .2848 * (1 - amount),
                        f: .0722 - .0722 * (1 - amount),
                        g: .2126 - .2126 * (1 - amount),
                        h: .0722 + .9278 * (1 - amount)
                    });
                }, Snap.filter.grayscale.toString = function() {
                    return this();
                }, Snap.filter.sepia = function(amount) {
                    return null == amount && (amount = 1), Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
                        a: .393 + .607 * (1 - amount),
                        b: .769 - .769 * (1 - amount),
                        c: .189 - .189 * (1 - amount),
                        d: .349 - .349 * (1 - amount),
                        e: .686 + .314 * (1 - amount),
                        f: .168 - .168 * (1 - amount),
                        g: .272 - .272 * (1 - amount),
                        h: .534 - .534 * (1 - amount),
                        i: .131 + .869 * (1 - amount)
                    });
                }, Snap.filter.sepia.toString = function() {
                    return this();
                }, Snap.filter.saturate = function(amount) {
                    return null == amount && (amount = 1), Snap.format('<feColorMatrix type="saturate" values="{amount}"/>', {
                        amount: 1 - amount
                    });
                }, Snap.filter.saturate.toString = function() {
                    return this();
                }, Snap.filter.hueRotate = function(angle) {
                    return angle = angle || 0, Snap.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {
                        angle: angle
                    });
                }, Snap.filter.hueRotate.toString = function() {
                    return this();
                }, Snap.filter.invert = function(amount) {
                    return null == amount && (amount = 1), Snap.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>', {
                        amount: amount,
                        amount2: 1 - amount
                    });
                }, Snap.filter.invert.toString = function() {
                    return this();
                }, Snap.filter.brightness = function(amount) {
                    return null == amount && (amount = 1), Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', {
                        amount: amount
                    });
                }, Snap.filter.brightness.toString = function() {
                    return this();
                }, Snap.filter.contrast = function(amount) {
                    return null == amount && (amount = 1), Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>', {
                        amount: amount,
                        amount2: .5 - amount / 2
                    });
                }, Snap.filter.contrast.toString = function() {
                    return this();
                };
            }), Snap.plugin(function(Snap, Element, Paper, glob, Fragment) {
                var box = Snap._.box, is = Snap.is, firstLetter = /^[^a-z]*([tbmlrc])/i, toString = function() {
                    return "T" + this.dx + "," + this.dy;
                };
                Element.prototype.getAlign = function(el, way) {
                    null == way && is(el, "string") && (way = el, el = null), el = el || this.paper;
                    var bx = el.getBBox ? el.getBBox() : box(el), bb = this.getBBox(), out = {};
                    switch (way = way && way.match(firstLetter), way = way ? way[1].toLowerCase() : "c") {
                      case "t":
                        out.dx = 0, out.dy = bx.y - bb.y;
                        break;

                      case "b":
                        out.dx = 0, out.dy = bx.y2 - bb.y2;
                        break;

                      case "m":
                        out.dx = 0, out.dy = bx.cy - bb.cy;
                        break;

                      case "l":
                        out.dx = bx.x - bb.x, out.dy = 0;
                        break;

                      case "r":
                        out.dx = bx.x2 - bb.x2, out.dy = 0;
                        break;

                      default:
                        out.dx = bx.cx - bb.cx, out.dy = 0;
                    }
                    return out.toString = toString, out;
                }, Element.prototype.align = function(el, way) {
                    return this.transform("..." + this.getAlign(el, way));
                };
            }), Snap;
        });
    }, {
        eve: 6
    } ]
}, {}, [ 1 ]);