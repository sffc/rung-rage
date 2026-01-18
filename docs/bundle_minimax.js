"use strict";

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
        return arr2;
    }
    return Array.from(arr);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}

var _createClass = function() {
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

!function() {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a;
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function(r) {
                    var n = e[i][1][r];
                    return o(n || r);
                }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o;
    }
    return r;
}()({
    1: [ function(require, module, exports) {
        var GameState = require("../lib/state").GameState, MinimaxPlayer = require("../lib/minimax").MinimaxPlayer, minimax = new MinimaxPlayer();
        onmessage = function(e) {
            var gameState = GameState.fromHashCode(e.data), computerMove = minimax.computeMove(gameState);
            postMessage(computerMove);
        };
    }, {
        "../lib/minimax": 2,
        "../lib/state": 3
    } ],
    2: [ function(require, module, exports) {
        function shuffle(a) {
            var j, x, i;
            for (i = a.length; i; i--) j = Math.floor(Math.random() * i), x = a[i - 1], a[i - 1] = a[j], 
            a[j] = x;
        }
        var DEFAULT_MAX_DEPTH = 3, DEFAULT_MAX_BREADTH = 10, MinimaxPlayer = function() {
            function MinimaxPlayer() {
                _classCallCheck(this, MinimaxPlayer), this.maxDepth = DEFAULT_MAX_DEPTH, this.maxBreadth = DEFAULT_MAX_BREADTH, 
                this.playsReverse = !1;
            }
            return _createClass(MinimaxPlayer, [ {
                key: "computeMove",
                value: function(gameState) {
                    var candidate = this._recurse(gameState, 0, {});
                    return {
                        rungs: candidate.move[0],
                        player: candidate.move[1]
                    };
                }
            }, {
                key: "_recurse",
                value: function(gameState, level, cache) {
                    var size = gameState.size, key = gameState.hashCode(), isTopPlayersTurn = gameState.isTopPlayersTurn();
                    if (gameState.rungs.getCount() >= 2 * size) return {
                        score: gameState.getScore(!1),
                        move: null
                    };
                    if (level >= this.maxDepth) return {
                        score: gameState.getScore(!1),
                        move: null
                    };
                    if (!cache[key]) {
                        var player = isTopPlayersTurn ? gameState.p1 : gameState.p2, bestCandidate = {
                            score: isTopPlayersTurn ? -999 : 999,
                            move: null
                        }, playerMoves = player.getLegalMoves();
                        0 === playerMoves.length && (console.error("WARNING: No legal player moves on game state " + gameState.hashCode()), 
                        console.error(gameState.toString())), shuffle(playerMoves), playerMoves.splice(this.maxBreadth);
                        var _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0;
                        try {
                            for (var _step, _iterator = playerMoves[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0) {
                                var playerMove = _step.value;
                                player.setPosition.apply(player, _toConsumableArray(playerMove));
                                var rungsMoves = gameState.rungs.getLegalMoves();
                                0 === rungsMoves.length && (console.error("WARNING: No legal rung moves on game state " + gameState.hashCode()), 
                                console.error(gameState.toString())), shuffle(rungsMoves), rungsMoves.splice(this.maxBreadth);
                                var _iteratorNormalCompletion2 = !0, _didIteratorError2 = !1, _iteratorError2 = void 0;
                                try {
                                    for (var _step2, _iterator2 = rungsMoves[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = !0) {
                                        var _gameState$rungs, _gameState$rungs2, rungMove = _step2.value;
                                        (_gameState$rungs = gameState.rungs).setPosition.apply(_gameState$rungs, _toConsumableArray(rungMove));
                                        var candidate = this._recurse(gameState, level + 1, cache);
                                        ((isTopPlayersTurn || this.playsReverse) && candidate.score > bestCandidate.score || (!isTopPlayersTurn || this.playsReverse) && candidate.score < bestCandidate.score) && (bestCandidate.score = candidate.score, 
                                        bestCandidate.move = [ rungMove, playerMove ]), (_gameState$rungs2 = gameState.rungs).clearPosition.apply(_gameState$rungs2, _toConsumableArray(rungMove));
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
                                player.clearPosition.apply(player, _toConsumableArray(playerMove));
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
                        return bestCandidate;
                    }
                    return cache[key];
                }
            } ]), MinimaxPlayer;
        }();
        module.exports = {
            MinimaxPlayer: MinimaxPlayer
        };
    }, {} ],
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
                    var result = "\n", _iteratorNormalCompletion3 = !0, _didIteratorError3 = !1, _iteratorError3 = void 0;
                    try {
                        for (var _step3, _iterator3 = this.p1.getPositions()[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = !0) {
                            var value = _step3.value;
                            result += value + " ";
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
                    result += "\n";
                    for (var matrix = this.rungs.getMatrix(), i = 0; i < matrix.length; i++) {
                        var row = matrix[i];
                        result += "|";
                        for (var j = 0; j < row.length; j++) result += row[j] + "|";
                        result += "\n";
                    }
                    var _iteratorNormalCompletion4 = !0, _didIteratorError4 = !1, _iteratorError4 = void 0;
                    try {
                        for (var _step4, _iterator4 = this.p2.getPositions()[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = !0) {
                            var _value = _step4.value;
                            result += _value + " ";
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
    }, {} ]
}, {}, [ 1 ]);