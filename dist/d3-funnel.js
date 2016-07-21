(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["d3"], factory);
	else if(typeof exports === 'object')
		exports["D3Funnel"] = factory(require("d3"));
	else
		root["D3Funnel"] = factory(root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Use CommonJS export to trick Webpack into working around the issues that
	// window.[module].default is set rather than window.[module]
	//
	// See: https://github.com/webpack/webpack/issues/706

	module.exports = __webpack_require__(1).default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _d = __webpack_require__(2);

	var _d2 = _interopRequireDefault(_d);

	var _Colorizer = __webpack_require__(3);

	var _Colorizer2 = _interopRequireDefault(_Colorizer);

	var _LabelFormatter = __webpack_require__(4);

	var _LabelFormatter2 = _interopRequireDefault(_LabelFormatter);

	var _Navigator = __webpack_require__(5);

	var _Navigator2 = _interopRequireDefault(_Navigator);

	var _Utils = __webpack_require__(6);

	var _Utils2 = _interopRequireDefault(_Utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var D3Funnel = function () {

		/**
	  * @param {string} selector A selector for the container element.
	  *
	  * @return {void}
	  */

		function D3Funnel(selector) {
			_classCallCheck(this, D3Funnel);

			this.selector = selector;

			this.colorizer = new _Colorizer2.default();
			this.labelFormatter = new _LabelFormatter2.default();
			this.navigator = new _Navigator2.default();

			this.id = null;
			this.autoId = 0;

			// Bind event handlers
			this.onMouseOver = this.onMouseOver.bind(this);
			this.onMouseOut = this.onMouseOut.bind(this);
		}

		/**
	  * Remove the funnel and its events from the DOM.
	  *
	  * @return {void}
	  */


		_createClass(D3Funnel, [{
			key: 'destroy',
			value: function destroy() {
				var container = _d2.default.select(this.selector);

				// D3's remove method appears to be sufficient for removing the events
				container.selectAll('svg').remove();

				// Remove other elements from container
				container.selectAll('*').remove();

				// Remove inner text from container
				container.text('');
			}

			/**
	   * Draw the chart inside the container with the data and configuration
	   * specified. This will remove any previous SVG elements in the container
	   * and draw a new funnel chart on top of it.
	   *
	   * @param {Array}  data    A list of rows containing a category, a count,
	   *                         and optionally a color (in hex).
	   * @param {Object} options An optional configuration object to override
	   *                         defaults. See the docs.
	   *
	   * @return {void}
	   */

		}, {
			key: 'draw',
			value: function draw(data) {
				var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

				this.destroy();

				this.initialize(data, options);

				this.drawOntoDom();
			}

			/**
	   * Initialize and calculate important variables for drawing the chart.
	   *
	   * @param {Array}  data
	   * @param {Object} options
	   *
	   * @return {void}
	   */

		}, {
			key: 'initialize',
			value: function initialize(data, options) {
				this.validateData(data);

				var settings = this.getSettings(options);

				this.id = this.generateUniqueId();
				this.colorizer.setInstanceId(this.id);

				// Set labels
				this.label = settings.label;
				this.labelFormatter.setFormat(this.label.format);

				// Set color scales
				this.colorizer.setLabelFill(settings.label.fill);
				this.colorizer.setScale(settings.block.fill.scale);

				// Initialize funnel chart settings
				this.width = settings.chart.width;
				this.height = settings.chart.height;
				this.bottomWidth = settings.chart.width * settings.chart.bottomWidth;
				this.bottomPinch = settings.chart.bottomPinch;
				this.isInverted = settings.chart.inverted;
				this.isCurved = settings.chart.curve.enabled;
				this.addValueOverlay = settings.block.barOverlay;
				this.curveHeight = settings.chart.curve.height;
				this.fillType = settings.block.fill.type;
				this.hoverEffects = settings.block.highlight;
				this.dynamicHeight = settings.block.dynamicHeight;
				this.dynamicSlope = settings.block.dynamicSlope;
				this.minHeight = settings.block.minHeight;
				this.animation = settings.chart.animate;
				this.totalCount = settings.chart.totalCount;

				// Support for events
				this.onBlockClick = settings.events.click.block;

				this.setBlocks(data);

				// Calculate the bottom left x position
				this.bottomLeftX = (this.width - this.bottomWidth) / 2;

				// Change in x direction
				this.dx = this.getDx();

				// Change in y direction
				this.dy = this.getDy();
			}

			/**
	   * @param {Array} data
	   *
	   * @return void
	   */

		}, {
			key: 'validateData',
			value: function validateData(data) {
				if (Array.isArray(data) === false) {
					throw new Error('Data must be an array.');
				}

				if (data.length === 0) {
					throw new Error('Data array must contain at least one element.');
				}

				if (Array.isArray(data[0]) === false) {
					throw new Error('Data array elements must be arrays.');
				}

				if (data[0].length < 2) {
					throw new Error('Data array elements must contain a label and value.');
				}
			}

			/**
	   * @param {Object} options
	   *
	   * @return {Object}
	   */

		}, {
			key: 'getSettings',
			value: function getSettings(options) {
				var containerDimensions = this.getContainerDimensions();
				var defaults = this.getDefaultSettings(containerDimensions);

				// Prepare the configuration settings based on the defaults
				var settings = _Utils2.default.extend({}, defaults);

				// Override default settings with user options
				settings = _Utils2.default.extend(settings, options);

				// Account for any percentage-based dimensions
				settings.chart = _extends({}, settings.chart, this.castDimensions(settings, containerDimensions));

				return settings;
			}

			/**
	   * Return default settings.
	   *
	   * @param {Object} containerDimensions
	   *
	   * @return {Object}
	   */

		}, {
			key: 'getDefaultSettings',
			value: function getDefaultSettings(containerDimensions) {
				var settings = D3Funnel.defaults;

				// Set the default width and height based on the container
				settings.chart = _extends({}, settings.chart, containerDimensions);

				return settings;
			}

			/**
	   * Get the width/height dimensions of the container.
	   *
	   * @return {{width: Number, height: Number}}
	   */

		}, {
			key: 'getContainerDimensions',
			value: function getContainerDimensions() {
				return {
					width: parseFloat(_d2.default.select(this.selector).style('width')),
					height: parseFloat(_d2.default.select(this.selector).style('height'))
				};
			}

			/**
	   * Cast dimensions into tangible or meaningful numbers.
	   *
	   * @param {Object} chart
	   * @param {Object} containerDimensions
	   *
	   * @return {{width: Number, height: Number}}
	   */

		}, {
			key: 'castDimensions',
			value: function castDimensions(_ref, containerDimensions) {
				var chart = _ref.chart;

				var dimensions = {};

				['width', 'height'].forEach(function (direction) {
					var chartDimension = chart[direction];
					var containerDimension = containerDimensions[direction];

					if (/%$/.test(String(chartDimension))) {
						// Convert string into a percentage of the container
						dimensions[direction] = parseFloat(chartDimension) / 100 * containerDimension;
					} else if (chartDimension <= 0) {
						// If case of non-positive number, set to a usable number
						dimensions[direction] = D3Funnel.defaults.chart[direction];
					} else {
						dimensions[direction] = chartDimension;
					}
				});

				return dimensions;
			}

			/**
	   * Register the raw data into a standard block format and pre-calculate
	   * some values.
	   *
	   * @param {Array} data
	   *
	   * @return void
	   */

		}, {
			key: 'setBlocks',
			value: function setBlocks(data) {
				var totalCount = this.getTotalCount(data);

				this.blocks = this.standardizeData(data, totalCount);
			}

			/**
	   * Return the total count of all blocks.
	   *
	   * @param {Array} data
	   *
	   * @return {Number}
	   */

		}, {
			key: 'getTotalCount',
			value: function getTotalCount(data) {
				var _this = this;

				if (this.totalCount !== null) {
					return this.totalCount || 0;
				}

				var total = 0;

				data.forEach(function (block) {
					total += _this.getRawBlockCount(block);
				});

				return total;
			}

			/**
	   * Convert the raw data into a standardized format.
	   *
	   * @param {Array}  data
	   * @param {Number} totalCount
	   *
	   * @return {Array}
	   */

		}, {
			key: 'standardizeData',
			value: function standardizeData(data, totalCount) {
				var _this2 = this;

				var standardized = [];

				data.forEach(function (block, index) {
					var count = _this2.getRawBlockCount(block);
					var ratio = count / totalCount || 0;
					var label = block[0];

					standardized.push({
						index: index,
						ratio: ratio,
						value: count,
						height: _this2.height * ratio,
						fill: _this2.colorizer.getBlockFill(block, index, _this2.fillType),
						label: {
							raw: label,
							formatted: _this2.labelFormatter.format(label, block[1]),
							color: _this2.colorizer.getLabelFill(block)
						}
					});
				});

				return standardized;
			}

			/**
	   * Given a raw data block, return its count.
	   *
	   * @param {Array} block
	   *
	   * @return {Number}
	   */

		}, {
			key: 'getRawBlockCount',
			value: function getRawBlockCount(block) {
				return Array.isArray(block[1]) ? block[1][0] : block[1];
			}

			/**
	   * @return {Number}
	   */

		}, {
			key: 'getDx',
			value: function getDx() {
				// Will be sharper if there is a pinch
				if (this.bottomPinch > 0) {
					return this.bottomLeftX / (this.blocks.length - this.bottomPinch);
				}

				return this.bottomLeftX / this.blocks.length;
			}

			/**
	   * @return {Number}
	   */

		}, {
			key: 'getDy',
			value: function getDy() {
				// Curved chart needs reserved pixels to account for curvature
				if (this.isCurved) {
					return (this.height - this.curveHeight) / this.blocks.length;
				}

				return this.height / this.blocks.length;
			}

			/**
	   * Draw the chart onto the DOM.
	   *
	   * @return {void}
	   */

		}, {
			key: 'drawOntoDom',
			value: function drawOntoDom() {
				this.svg = _d2.default.select(this.selector) // Add the SVG
				.append('svg').attr('id', this.id).attr('width', this.width).attr('height', this.height);

				var newPaths = this.makePaths();
				this.blockPaths = newPaths[0];
				this.overlayPaths = newPaths[1];

				// Define color gradients
				if (this.fillType === 'gradient') {
					this.defineColorGradients(this.svg);
				}

				// Add top oval if curved
				if (this.isCurved) {
					this.drawTopOval(this.svg, this.blockPaths);
				}

				// Add each block
				this.drawBlock(0);
			}

			/**
	   * Return a unique ID for the funnel on the document.
	   *
	   * @return {string}
	   */

		}, {
			key: 'generateUniqueId',
			value: function generateUniqueId() {
				var findingId = true;
				var id = '';

				while (findingId) {
					id = 'd3-funnel-chart-' + this.autoId;

					if (document.getElementById(id) === null) {
						findingId = false;
					}

					this.autoId++;
				}

				return id;
			}

			/**
	   * Create the paths to be used to define the discrete funnel blocks and
	   * returns the results in an array.
	   *
	   * @return {Array, Array}
	   */

		}, {
			key: 'makePaths',
			value: function makePaths() {
				var _this3 = this;

				var paths = [];
				var overlayPaths = [];

				// Initialize velocity
				var dx = this.dx;
				var dy = this.dy;

				// Initialize starting positions
				var prevLeftX = 0;
				var prevRightX = this.width;
				var prevHeight = 0;

				// Start from the bottom for inverted
				if (this.isInverted) {
					prevLeftX = this.bottomLeftX;
					prevRightX = this.width - this.bottomLeftX;
				}

				// Initialize next positions
				var nextLeftX = 0;
				var nextRightX = 0;
				var nextHeight = 0;

				var centerX = this.width / 2;

				// Move down if there is an initial curve
				if (this.isCurved) {
					prevHeight = 10;
				}

				var totalHeight = this.height;

				// This is greedy in that the block will have a guaranteed height
				// and the remaining is shared among the ratio, instead of being
				// shared according to the remaining minus the guaranteed
				if (this.minHeight !== 0) {
					totalHeight = this.height - this.minHeight * this.blocks.length;
				}

				var slopeHeight = this.height;

				// Correct slope height if there are blocks being pinched (and thus
				// requiring a sharper curve)
				this.blocks.forEach(function (block, i) {
					if (_this3.bottomPinch > 0) {
						if (_this3.isInverted) {
							if (i < _this3.bottomPinch) {
								slopeHeight -= block.height;
							}
						} else if (i >= _this3.blocks.length - _this3.bottomPinch) {
							slopeHeight -= block.height;
						}
					}
				});

				// The slope will determine the where the x points on each block
				// iteration
				var slope = 2 * slopeHeight / (this.width - this.bottomWidth);

				// Create the path definition for each funnel block
				// Remember to loop back to the beginning point for a closed path
				this.blocks.forEach(function (block, i) {
					// Make heights proportional to block weight
					if (_this3.dynamicHeight) {
						// Slice off the height proportional to this block
						dy = totalHeight * block.ratio;

						// Add greedy minimum height
						if (_this3.minHeight !== 0) {
							dy += _this3.minHeight;
						}

						// Account for any curvature
						if (_this3.isCurved) {
							dy = dy - _this3.curveHeight / _this3.blocks.length;
						}

						// Given: y = mx + b
						// Given: b = 0 (when funnel), b = this.height (when pyramid)
						// For funnel, x_i = y_i / slope
						nextLeftX = (prevHeight + dy) / slope;

						// For pyramid, x_i = y_i - this.height / -slope
						if (_this3.isInverted) {
							nextLeftX = (prevHeight + dy - _this3.height) / (-1 * slope);
						}

						// If bottomWidth is 0, adjust last x position (to circumvent
						// errors associated with rounding)
						if (_this3.bottomWidth === 0 && i === _this3.blocks.length - 1) {
							// For funnel, last position is the center
							nextLeftX = _this3.width / 2;

							// For pyramid, last position is the origin
							if (_this3.isInverted) {
								nextLeftX = 0;
							}
						}

						// If bottomWidth is same as width, stop x velocity
						if (_this3.bottomWidth === _this3.width) {
							nextLeftX = prevLeftX;
						}

						// Calculate the shift necessary for both x points
						dx = nextLeftX - prevLeftX;

						if (_this3.isInverted) {
							dx = prevLeftX - nextLeftX;
						}
					}

					// Make slope width proportional to block value decrease
					if (_this3.dynamicSlope) {
						var nextBlockValue = _this3.blocks[i + 1] ? _this3.blocks[i + 1].value : block.value;

						var widthPercent = 1 - nextBlockValue / block.value;
						dx = widthPercent * (centerX - prevLeftX);
					}

					// Stop velocity for pinched blocks
					if (_this3.bottomPinch > 0) {
						// Check if we've reached the bottom of the pinch
						// If so, stop changing on x
						if (!_this3.isInverted) {
							if (i >= _this3.blocks.length - _this3.bottomPinch) {
								dx = 0;
							}
							// Pinch at the first blocks relating to the bottom pinch
							// Revert back to normal velocity after pinch
						} else {
								// Revert velocity back to the initial if we are using
								// static area's (prevents zero velocity if isInverted
								// and bottomPinch are non trivial and dynamicHeight is
								// false)
								if (!_this3.dynamicHeight) {
									dx = _this3.dx;
								}

								dx = i < _this3.bottomPinch ? 0 : dx;
							}
					}

					// Calculate the position of next block
					nextLeftX = prevLeftX + dx;
					nextRightX = prevRightX - dx;
					nextHeight = prevHeight + dy;

					// Expand outward if inverted
					if (_this3.isInverted) {
						nextLeftX = prevLeftX - dx;
						nextRightX = prevRightX + dx;
					}

					var dimensions = {
						centerX: centerX,
						prevLeftX: prevLeftX,
						prevRightX: prevRightX,
						prevHeight: prevHeight,
						nextLeftX: nextLeftX,
						nextRightX: nextRightX,
						nextHeight: nextHeight,
						curveHeight: _this3.curveHeight,
						ratio: block.ratio
					};

					if (_this3.isCurved) {
						paths = [].concat(_toConsumableArray(paths), [_this3.navigator.makeCurvedPaths(dimensions)]);

						if (_this3.addValueOverlay) {
							overlayPaths = [].concat(_toConsumableArray(overlayPaths), [_this3.navigator.makeCurvedPaths(dimensions, true)]);
						}
					} else {
						paths = [].concat(_toConsumableArray(paths), [_this3.navigator.makeStraightPaths(dimensions)]);

						if (_this3.addValueOverlay) {
							overlayPaths = [].concat(_toConsumableArray(overlayPaths), [_this3.navigator.makeStraightPaths(dimensions, true)]);
						}
					}

					// Set the next block's previous position
					prevLeftX = nextLeftX;
					prevRightX = nextRightX;
					prevHeight = nextHeight;
				});

				return [paths, overlayPaths];
			}

			/**
	   * Define the linear color gradients.
	   *
	   * @param {Object} svg
	   *
	   * @return {void}
	   */

		}, {
			key: 'defineColorGradients',
			value: function defineColorGradients(svg) {
				var _this4 = this;

				var defs = svg.append('defs');

				// Create a gradient for each block
				this.blocks.forEach(function (block, index) {
					var color = block.fill.raw;
					var shade = _this4.colorizer.shade(color, -0.2);

					// Create linear gradient
					var gradient = defs.append('linearGradient').attr({ id: _this4.colorizer.getGradientId(index) });

					// Define the gradient stops
					var stops = [[0, shade], [40, color], [60, color], [100, shade]];

					// Add the gradient stops
					stops.forEach(function (stop) {
						gradient.append('stop').attr({
							offset: stop[0] + '%',
							style: 'stop-color: ' + stop[1]
						});
					});
				});
			}

			/**
	   * Draw the top oval of a curved funnel.
	   *
	   * @param {Object} svg
	   * @param {Array}  blockPaths
	   *
	   * @return {void}
	   */

		}, {
			key: 'drawTopOval',
			value: function drawTopOval(svg, blockPaths) {
				var leftX = 0;
				var rightX = this.width;
				var centerX = this.width / 2;

				if (this.isInverted) {
					leftX = this.bottomLeftX;
					rightX = this.width - this.bottomLeftX;
				}

				// Create path from top-most block
				var paths = blockPaths[0];
				var topCurve = paths[1][1] + this.curveHeight - 10;

				var path = this.navigator.plot([['M', leftX, paths[0][1]], ['Q', centerX, topCurve], [' ', rightX, paths[2][1]], ['M', rightX, 10], ['Q', centerX, 0], [' ', leftX, 10]]);

				// Draw top oval
				svg.append('path').attr('fill', this.colorizer.shade(this.blocks[0].fill.raw, -0.4)).attr('d', path);
			}

			/**
	   * Draw the next block in the iteration.
	   *
	   * @param {int} index
	   *
	   * @return {void}
	   */

		}, {
			key: 'drawBlock',
			value: function drawBlock(index) {
				var _this5 = this;

				if (index === this.blocks.length) {
					return;
				}

				// Create a group just for this block
				var group = this.svg.append('g');

				// Fetch path element
				var path = this.getBlockPath(group, index);

				// Attach data to the element
				this.attachData(path, this.blocks[index]);

				var overlayPath = null;
				var pathColor = this.blocks[index].fill.actual;

				if (this.addValueOverlay) {
					overlayPath = this.getOverlayPath(group, index);
					this.attachData(overlayPath, this.blocks[index]);

					// Add data attribute to distinguish between paths
					path.node().setAttribute('pathType', 'background');
					overlayPath.node().setAttribute('pathType', 'foreground');

					// Default path becomes background of lighter shade
					pathColor = this.colorizer.shade(this.blocks[index].fill.raw, 0.3);
				}

				// Add animation components
				if (this.animation !== 0) {
					path.transition().duration(this.animation).ease('linear').attr('fill', pathColor).attr('d', this.getPathDefinition(index)).each('end', function () {
						_this5.drawBlock(index + 1);
					});
				} else {
					path.attr('fill', pathColor).attr('d', this.getPathDefinition(index));
					this.drawBlock(index + 1);
				}

				// Add path overlay
				if (this.addValueOverlay) {
					path.attr('stroke', this.blocks[index].fill.raw);

					if (this.animation !== 0) {
						overlayPath.transition().duration(this.animation).ease('linear').attr('fill', this.blocks[index].fill.actual).attr('d', this.getOverlayPathDefinition(index));
					} else {
						overlayPath.attr('fill', this.blocks[index].fill.actual).attr('d', this.getOverlayPathDefinition(index));
					}
				}

				// Add the hover events
				if (this.hoverEffects) {
					[path, overlayPath].forEach(function (target) {
						if (!target) {
							return;
						}

						target.on('mouseover', _this5.onMouseOver).on('mouseout', _this5.onMouseOut);
					});
				}

				// Add block click event
				if (this.onBlockClick !== null) {
					[path, overlayPath].forEach(function (target) {
						if (!target) {
							return;
						}

						target.on('click', _this5.onBlockClick);
					});
				}

				this.addBlockLabel(group, index);
			}

			/**
	   * @param {Object} group
	   * @param {int}    index
	   *
	   * @return {Object}
	   */

		}, {
			key: 'getBlockPath',
			value: function getBlockPath(group, index) {
				var path = group.append('path');

				if (this.animation !== 0) {
					this.addBeforeTransition(path, index, false);
				}

				return path;
			}

			/**
	   * @param {Object} group
	   * @param {int}    index
	   *
	   * @return {Object}
	   */

		}, {
			key: 'getOverlayPath',
			value: function getOverlayPath(group, index) {
				var path = group.append('path');

				if (this.animation !== 0) {
					this.addBeforeTransition(path, index, true);
				}

				return path;
			}

			/**
	   * Set the attributes of a path element before its animation.
	   *
	   * @param {Object}  path
	   * @param {int}     index
	   * @param {boolean} isOverlay
	   *
	   * @return {void}
	   */

		}, {
			key: 'addBeforeTransition',
			value: function addBeforeTransition(path, index, isOverlay) {
				var paths = isOverlay ? this.overlayPaths[index] : this.blockPaths[index];

				var beforePath = '';
				var beforeFill = '';

				// Construct the top of the trapezoid and leave the other elements
				// hovering around to expand downward on animation
				if (!this.isCurved) {
					beforePath = this.navigator.plot([['M', paths[0][0], paths[0][1]], ['L', paths[1][0], paths[1][1]], ['L', paths[1][0], paths[1][1]], ['L', paths[0][0], paths[0][1]]]);
				} else {
					beforePath = this.navigator.plot([['M', paths[0][0], paths[0][1]], ['Q', paths[1][0], paths[1][1]], [' ', paths[2][0], paths[2][1]], ['L', paths[2][0], paths[2][1]], ['M', paths[2][0], paths[2][1]], ['Q', paths[1][0], paths[1][1]], [' ', paths[0][0], paths[0][1]]]);
				}

				// Use previous fill color, if available
				if (this.fillType === 'solid' && index > 0) {
					beforeFill = this.blocks[index - 1].fill.actual;
					// Otherwise use current background
				} else {
						beforeFill = this.blocks[index].fill.actual;
					}

				path.attr('d', beforePath).attr('fill', beforeFill);
			}

			/**
	   * Attach data to the target element. Also attach the current node to the
	   * data object.
	   *
	   * @param {Object} element
	   * @param {Object} data
	   *
	   * @return {void}
	   */

		}, {
			key: 'attachData',
			value: function attachData(element, data) {
				var nodeData = _extends({}, data, {
					node: element.node()
				});

				element.data([nodeData]);
			}

			/**
	   * @param {int} index
	   *
	   * @return {string}
	   */

		}, {
			key: 'getPathDefinition',
			value: function getPathDefinition(index) {
				var commands = [];

				this.blockPaths[index].forEach(function (command) {
					commands.push([command[2], command[0], command[1]]);
				});

				return this.navigator.plot(commands);
			}

			/**
	   * @param {int} index
	   *
	   * @return {string}
	   */

		}, {
			key: 'getOverlayPathDefinition',
			value: function getOverlayPathDefinition(index) {
				var commands = [];

				this.overlayPaths[index].forEach(function (command) {
					commands.push([command[2], command[0], command[1]]);
				});

				return this.navigator.plot(commands);
			}

			/**
	   * @param {Object} data
	   *
	   * @return {void}
	   */

		}, {
			key: 'onMouseOver',
			value: function onMouseOver(data) {
				var children = _d2.default.event.target.parentElement.childNodes;

				for (var i = 0; i < children.length; i++) {
					// Highlight all paths within one block
					var node = children[i];

					if (node.nodeName.toLowerCase() === 'path') {
						var type = node.getAttribute('pathType') || '';

						if (type === 'foreground') {
							_d2.default.select(node).attr('fill', this.colorizer.shade(data.fill.raw, -0.5));
						} else {
							_d2.default.select(node).attr('fill', this.colorizer.shade(data.fill.raw, -0.2));
						}
					}
				}
			}

			/**
	   * @param {Object} data
	   *
	   * @return {void}
	   */

		}, {
			key: 'onMouseOut',
			value: function onMouseOut(data) {
				var children = _d2.default.event.target.parentElement.childNodes;

				for (var i = 0; i < children.length; i++) {
					// Restore original color for all paths of a block
					var node = children[i];

					if (node.nodeName.toLowerCase() === 'path') {
						var type = node.getAttribute('pathType') || '';

						if (type === 'background') {
							var backgroundColor = this.colorizer.shade(data.fill.raw, 0.3);
							_d2.default.select(node).attr('fill', backgroundColor);
						} else {
							_d2.default.select(node).attr('fill', data.fill.actual);
						}
					}
				}
			}

			/**
	   * @param {Object} group
	   * @param {int}    index
	   *
	   * @return {void}
	   */

		}, {
			key: 'addBlockLabel',
			value: function addBlockLabel(group, index) {
				var paths = this.blockPaths[index];

				var formattedLabel = this.blocks[index].label.formatted;
				var fill = this.blocks[index].label.color;

				var x = this.width / 2; // Center the text
				var y = this.getTextY(paths);

				var text = group.append('text').attr({
					x: x,
					y: y,
					fill: fill,
					'font-size': this.label.fontSize,
					'text-anchor': 'middle',
					'dominant-baseline': 'middle',
					'pointer-events': 'none'
				});

				// Add font-family, if exists
				if (this.label.fontFamily !== null) {
					text.attr('font-family', this.label.fontFamily);
				}

				this.addLabelLines(text, formattedLabel, x);
			}

			/**
	   * Add <tspan> elements for each line of the formatted label.
	   *
	   * @param {Object} text
	   * @param {String} formattedLabel
	   * @param {Number} x
	   *
	   * @return {void}
	   */

		}, {
			key: 'addLabelLines',
			value: function addLabelLines(text, formattedLabel, x) {
				var lines = formattedLabel.split('\n');
				var lineHeight = 20;

				// dy will signify the change from the initial height y
				// We need to initially start the first line at the very top, factoring
				// in the other number of lines
				var initialDy = -1 * lineHeight * (lines.length - 1) / 2;

				lines.forEach(function (line, i) {
					var dy = i === 0 ? initialDy : lineHeight;

					text.append('tspan').attr({ x: x, dy: dy }).text(line);
				});
			}

			/**
	   * Returns the y position of the given label's text. This is determined by
	   * taking the mean of the bases.
	   *
	   * @param {Array} paths
	   *
	   * @return {Number}
	   */

		}, {
			key: 'getTextY',
			value: function getTextY(paths) {
				if (this.isCurved) {
					return (paths[2][1] + paths[3][1]) / 2 + this.curveHeight / this.blocks.length;
				}

				return (paths[1][1] + paths[2][1]) / 2;
			}
		}]);

		return D3Funnel;
	}();

	D3Funnel.defaults = {
		chart: {
			width: 350,
			height: 400,
			bottomWidth: 1 / 3,
			bottomPinch: 0,
			inverted: false,
			horizontal: false,
			animate: 0,
			curve: {
				enabled: false,
				height: 20
			},
			totalCount: null
		},
		block: {
			dynamicHeight: false,
			dynamicSlope: false,
			barOverlay: false,
			fill: {
				scale: _d2.default.scale.category10().domain(_d2.default.range(0, 10)),
				type: 'solid'
			},
			minHeight: 0,
			highlight: false
		},
		label: {
			fontFamily: null,
			fontSize: '14px',
			fill: '#fff',
			format: '{l}: {f}'
		},
		events: {
			click: {
				block: null
			}
		}
	};
	exports.default = D3Funnel;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Colorizer = function () {
		/**
	  * @return {void}
	  */

		function Colorizer() {
			_classCallCheck(this, Colorizer);

			this.hexExpression = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
			this.instanceId = null;
			this.labelFill = null;
			this.scale = null;
		}

		/**
	  * @param {string} instanceId
	  *
	  * @return {void}
	  */


		_createClass(Colorizer, [{
			key: 'setInstanceId',
			value: function setInstanceId(instanceId) {
				this.instanceId = instanceId;
			}

			/**
	   * @param {string} fill
	   *
	   * @return {void}
	   */

		}, {
			key: 'setLabelFill',
			value: function setLabelFill(fill) {
				this.labelFill = fill;
			}

			/**
	   * @param {function|Array} scale
	   *
	   * @return {void}
	   */

		}, {
			key: 'setScale',
			value: function setScale(scale) {
				this.scale = scale;
			}

			/**
	   * Given a raw data block, return an appropriate color for the block.
	   *
	   * @param {Array}  block
	   * @param {Number} index
	   * @param {string} type
	   * @param {string} instanceId
	   *
	   * @return {Object}
	   */

		}, {
			key: 'getBlockFill',
			value: function getBlockFill(block, index, type, instanceId) {
				var raw = this.getBlockRawFill(block, index);

				return {
					raw: raw,
					actual: this.getBlockActualFill(raw, index, type, instanceId)
				};
			}

			/**
	   * Return the raw hex color for the block.
	   *
	   * @param {Array}  block
	   * @param {Number} index
	   *
	   * @return {string}
	   */

		}, {
			key: 'getBlockRawFill',
			value: function getBlockRawFill(block, index) {
				// Use the block's color, if set and valid
				if (block.length > 2 && this.hexExpression.test(block[2])) {
					return block[2];
				}

				// Otherwise, attempt to use the array scale
				if (Array.isArray(this.scale)) {
					return this.scale[index];
				}

				// Finally, use a functional scale
				return this.scale(index);
			}

			/**
	   * Return the actual background for the block.
	   *
	   * @param {string} raw
	   * @param {Number} index
	   * @param {string} type
	   *
	   * @return {string}
	   */

		}, {
			key: 'getBlockActualFill',
			value: function getBlockActualFill(raw, index, type) {
				if (type === 'solid') {
					return raw;
				}

				return 'url(#' + this.getGradientId(index) + ')';
			}

			/**
	   * Return the gradient ID for the given index.
	   *
	   * @param {Number} index
	   *
	   * @return {string}
	   */

		}, {
			key: 'getGradientId',
			value: function getGradientId(index) {
				return this.instanceId + '-gradient-' + index;
			}

			/**
	   * Given a raw data block, return an appropriate label color.
	   *
	   * @param {Array} block
	   *
	   * @return {string}
	   */

		}, {
			key: 'getLabelFill',
			value: function getLabelFill(block) {
				// Use the label's color, if set and valid
				if (block.length > 3 && this.hexExpression.test(block[3])) {
					return block[3];
				}

				return this.labelFill;
			}

			/**
	   * Shade a color to the given percentage.
	   *
	   * @param {string} color A hex color.
	   * @param {number} shade The shade adjustment. Can be positive or negative.
	   *
	   * @return {string}
	   */

		}, {
			key: 'shade',
			value: function shade(color, _shade) {
				var hex = color.slice(1);

				if (hex.length === 3) {
					hex = this.expandHex(hex);
				}

				var f = parseInt(hex, 16);
				var t = _shade < 0 ? 0 : 255;
				var p = _shade < 0 ? _shade * -1 : _shade;

				var R = f >> 16;
				var G = f >> 8 & 0x00FF;
				var B = f & 0x0000FF;

				var converted = 0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B);

				return '#' + converted.toString(16).slice(1);
			}

			/**
	   * Expands a three character hex code to six characters.
	   *
	   * @param {string} hex
	   *
	   * @return {string}
	   */

		}, {
			key: 'expandHex',
			value: function expandHex(hex) {
				return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
			}
		}]);

		return Colorizer;
	}();

	exports.default = Colorizer;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LabelFormatter = function () {
		/**
	  * Initial the formatter.
	  *
	  * @return {void}
	  */

		function LabelFormatter() {
			_classCallCheck(this, LabelFormatter);

			this.expression = null;
		}

		/**
	  * Register the format function.
	  *
	  * @param {string|function} format
	  *
	  * @return {void}
	  */


		_createClass(LabelFormatter, [{
			key: 'setFormat',
			value: function setFormat(format) {
				if (typeof format === 'function') {
					this.formatter = format;
				} else {
					this.expression = format;
					this.formatter = this.stringFormatter;
				}
			}

			/**
	   * Format the given value according to the data point or the format.
	   *
	   * @param {string} label
	   * @param {number} value
	   *
	   * @return string
	   */

		}, {
			key: 'format',
			value: function format(label, value) {
				// Try to use any formatted value specified through the data
				// Otherwise, attempt to use the format function
				if (Array.isArray(value)) {
					return this.formatter(label, value[0], value[1]);
				}

				return this.formatter(label, value, null);
			}

			/**
	   * Format the string according to a simple expression.
	   *
	   * {l}: label
	   * {v}: raw value
	   * {f}: formatted value
	   *
	   * @param {string} label
	   * @param {number} value
	   * @param {*}      fValue
	   *
	   * @return {string}
	   */

		}, {
			key: 'stringFormatter',
			value: function stringFormatter(label, value) {
				var fValue = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

				var formatted = fValue;

				// Attempt to use supplied formatted value
				// Otherwise, use the default
				if (fValue === null) {
					formatted = this.getDefaultFormattedValue(value);
				}

				return this.expression.split('{l}').join(label).split('{v}').join(value).split('{f}').join(formatted);
			}

			/**
	   * @param {number} value
	   *
	   * @return {string}
	   */

		}, {
			key: 'getDefaultFormattedValue',
			value: function getDefaultFormattedValue(value) {
				return value.toLocaleString();
			}
		}]);

		return LabelFormatter;
	}();

	exports.default = LabelFormatter;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Navigator = function () {
		function Navigator() {
			_classCallCheck(this, Navigator);
		}

		_createClass(Navigator, [{
			key: 'plot',

			/**
	   * Given a list of path commands, returns the compiled description.
	   *
	   * @param {Array} commands
	   *
	   * @return {string}
	   */
			value: function plot(commands) {
				var path = '';

				commands.forEach(function (command) {
					path += '' + command[0] + command[1] + ',' + command[2] + ' ';
				});

				return path.replace(/ +/g, ' ').trim();
			}

			/**
	   * @param {Object}  dimensions
	   * @param {boolean} isValueOverlay
	   *
	   * @return {Array}
	   */

		}, {
			key: 'makeCurvedPaths',
			value: function makeCurvedPaths(dimensions) {
				var isValueOverlay = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

				var points = this.makeBezierPoints(dimensions);

				if (isValueOverlay) {
					return this.makeBezierPath(points, dimensions.ratio);
				}

				return this.makeBezierPath(points);
			}

			/**
	   * @param {Number} centerX
	   * @param {Number} prevLeftX
	   * @param {Number} prevRightX
	   * @param {Number} prevHeight
	   * @param {Number} nextLeftX
	   * @param {Number} nextRightX
	   * @param {Number} nextHeight
	   * @param {Number} curveHeight
	   *
	   * @return {Object}
	   */

		}, {
			key: 'makeBezierPoints',
			value: function makeBezierPoints(_ref) {
				var centerX = _ref.centerX;
				var prevLeftX = _ref.prevLeftX;
				var prevRightX = _ref.prevRightX;
				var prevHeight = _ref.prevHeight;
				var nextLeftX = _ref.nextLeftX;
				var nextRightX = _ref.nextRightX;
				var nextHeight = _ref.nextHeight;
				var curveHeight = _ref.curveHeight;

				return {
					p00: {
						x: prevLeftX,
						y: prevHeight
					},
					p01: {
						x: centerX,
						y: prevHeight + curveHeight - 10
					},
					p02: {
						x: prevRightX,
						y: prevHeight
					},

					p10: {
						x: nextLeftX,
						y: nextHeight
					},
					p11: {
						x: centerX,
						y: nextHeight + curveHeight
					},
					p12: {
						x: nextRightX,
						y: nextHeight
					}
				};
			}

			/**
	   * @param {Object} p00
	   * @param {Object} p01
	   * @param {Object} p02
	   * @param {Object} p10
	   * @param {Object} p11
	   * @param {Object} p12
	   * @param {Number} ratio
	   *
	   * @return {Array}
	   */

		}, {
			key: 'makeBezierPath',
			value: function makeBezierPath(_ref2) {
				var p00 = _ref2.p00;
				var p01 = _ref2.p01;
				var p02 = _ref2.p02;
				var p10 = _ref2.p10;
				var p11 = _ref2.p11;
				var p12 = _ref2.p12;
				var ratio = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

				var curve0 = this.getQuadraticBezierCurve(p00, p01, p02, ratio);
				var curve1 = this.getQuadraticBezierCurve(p10, p11, p12, ratio);

				return [
				// Top Bezier curve
				[curve0.p0.x, curve0.p0.y, 'M'], [curve0.p1.x, curve0.p1.y, 'Q'], [curve0.p2.x, curve0.p2.y, ''],
				// Right line
				[curve1.p2.x, curve1.p2.y, 'L'],
				// Bottom Bezier curve
				[curve1.p2.x, curve1.p2.y, 'M'], [curve1.p1.x, curve1.p1.y, 'Q'], [curve1.p0.x, curve1.p0.y, ''],
				// Left line
				[curve0.p0.x, curve0.p0.y, 'L']];
			}

			/**
	   * @param {Object} p0
	   * @param {Object} p1
	   * @param {Object} p2
	   * @param {Number} t
	   *
	   * @return {Object}
	   */

		}, {
			key: 'getQuadraticBezierCurve',
			value: function getQuadraticBezierCurve(p0, p1, p2) {
				var t = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

				// Quadratic Bezier curve syntax: M(P0) Q(P1) P2
				// Where P0, P2 are the curve endpoints and P1 is the control point

				// More generally, at 0 <= t <= 1, we have the following:
				// Q0(t), which varies linearly from P0 to P1
				// Q1(t), which varies linearly from P1 to P2
				// B(t), which is interpolated linearly between Q0(t) and Q1(t)

				// For an intermediate curve at 0 <= t <= 1:
				// P1(t) = Q0(t)
				// P2(t) = B(t)

				return {
					p0: p0,
					p1: {
						x: this.getLinearInterpolation(p0, p1, t, 'x'),
						y: this.getLinearInterpolation(p0, p1, t, 'y')
					},
					p2: {
						x: this.getQuadraticInterpolation(p0, p1, p2, t, 'x'),
						y: this.getQuadraticInterpolation(p0, p1, p2, t, 'y')
					}
				};
			}

			/**
	   * @param {Object} p0
	   * @param {Object} p1
	   * @param {Number} t
	   * @param {string} axis
	   *
	   * @return {Number}
	   */

		}, {
			key: 'getLinearInterpolation',
			value: function getLinearInterpolation(p0, p1, t, axis) {
				return p0[axis] + t * (p1[axis] - p0[axis]);
			}

			/**
	   * @param {Object} p0
	   * @param {Object} p1
	   * @param {Object} p2
	   * @param {Number} t
	   * @param {string} axis
	   *
	   * @return {Number}
	   */

		}, {
			key: 'getQuadraticInterpolation',
			value: function getQuadraticInterpolation(p0, p1, p2, t, axis) {
				return Math.pow(1 - t, 2) * p0[axis] + 2 * (1 - t) * t * p1[axis] + Math.pow(t, 2) * p2[axis];
			}

			/**
	   * @param {Number}  prevLeftX
	   * @param {Number}  prevRightX
	   * @param {Number}  prevHeight
	   * @param {Number}  nextLeftX
	   * @param {Number}  nextRightX
	   * @param {Number}  nextHeight
	   * @param {Number}  ratio
	   * @param {boolean} isValueOverlay
	   *
	   * @return {Object}
	   */

		}, {
			key: 'makeStraightPaths',
			value: function makeStraightPaths(_ref3) {
				var prevLeftX = _ref3.prevLeftX;
				var prevRightX = _ref3.prevRightX;
				var prevHeight = _ref3.prevHeight;
				var nextLeftX = _ref3.nextLeftX;
				var nextRightX = _ref3.nextRightX;
				var nextHeight = _ref3.nextHeight;
				var ratio = _ref3.ratio;
				var isValueOverlay = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

				if (isValueOverlay) {
					var lengthTop = prevRightX - prevLeftX;
					var lengthBtm = nextRightX - nextLeftX;
					var rightSideTop = lengthTop * (ratio || 0) + prevLeftX;
					var rightSideBtm = lengthBtm * (ratio || 0) + nextLeftX;

					// Overlay should not be longer than the max length of the path
					rightSideTop = Math.min(rightSideTop, lengthTop);
					rightSideBtm = Math.min(rightSideBtm, lengthBtm);

					return [
					// Start position
					[prevLeftX, prevHeight, 'M'],
					// Move to right
					[rightSideTop, prevHeight, 'L'],
					// Move down
					[rightSideBtm, nextHeight, 'L'],
					// Move to left
					[nextLeftX, nextHeight, 'L'],
					// Wrap back to top
					[prevLeftX, prevHeight, 'L']];
				}

				return [
				// Start position
				[prevLeftX, prevHeight, 'M'],
				// Move to right
				[prevRightX, prevHeight, 'L'],
				// Move down
				[nextRightX, nextHeight, 'L'],
				// Move to left
				[nextLeftX, nextHeight, 'L'],
				// Wrap back to top
				[prevLeftX, prevHeight, 'L']];
			}
		}]);

		return Navigator;
	}();

	exports.default = Navigator;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Utils = function () {
		function Utils() {
			_classCallCheck(this, Utils);
		}

		_createClass(Utils, null, [{
			key: 'isExtendableObject',

			/**
	   * Determine whether the given parameter is an extendable object.
	   *
	   * @param {*} a
	   *
	   * @return {boolean}
	   */
			value: function isExtendableObject(a) {
				return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && a !== null && !Array.isArray(a);
			}

			/**
	   * Extends an object with the members of another.
	   *
	   * @param {Object} a The object to be extended.
	   * @param {Object} b The object to clone from.
	   *
	   * @return {Object}
	   */

		}, {
			key: 'extend',
			value: function extend(a, b) {
				var result = {};

				// If a is non-trivial, extend the result with it
				if (Object.keys(a).length > 0) {
					result = Utils.extend({}, a);
				}

				// Copy over the properties in b into a
				Object.keys(b).forEach(function (prop) {
					if (Utils.isExtendableObject(b[prop])) {
						if (Utils.isExtendableObject(a[prop])) {
							result[prop] = Utils.extend(a[prop], b[prop]);
						} else {
							result[prop] = Utils.extend({}, b[prop]);
						}
					} else {
						result[prop] = b[prop];
					}
				});

				return result;
			}
		}]);

		return Utils;
	}();

	exports.default = Utils;

/***/ }
/******/ ])
});
;