/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 * @oncall draft_js
 */

'use strict';

function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Immutable = require("immutable");
var List = Immutable.List;
var DELIMITER = '.';

/**
 * A CompositeDraftDecorator traverses through a list of DraftDecorator
 * instances to identify sections of a ContentBlock that should be rendered
 * in a "decorated" manner. For example, hashtags, mentions, and links may
 * be intended to stand out visually, be rendered as anchors, etc.
 *
 * The list of decorators supplied to the constructor will be used in the
 * order they are provided. This allows the caller to specify a priority for
 * string matching, in case of match collisions among decorators.
 *
 * For instance, I may have a link with a `#` in its text. Though this section
 * of text may match our hashtag decorator, it should not be treated as a
 * hashtag. I should therefore list my link DraftDecorator
 * before my hashtag DraftDecorator when constructing this composite
 * decorator instance.
 *
 * Thus, when a collision like this is encountered, the earlier match is
 * preserved and the new match is discarded.
 */
var CompositeDraftDecorator = /*#__PURE__*/function () {
  function CompositeDraftDecorator(decorators) {
    _defineProperty(this, "_decorators", void 0);
    // Copy the decorator array, since we use this array order to determine
    // precedence of decoration matching. If the array is mutated externally,
    // we don't want to be affected here.
    this._decorators = decorators.slice();
  }

  /**
   * Returns true if this CompositeDraftDecorator has the same decorators as
   * the given array. This does a reference check, so the decorators themselves
   * have to be the same objects.
   */
  var _proto = CompositeDraftDecorator.prototype;
  _proto.isCompositionOfDecorators = function isCompositionOfDecorators(arr) {
    if (this._decorators.length !== arr.length) {
      return false;
    }
    for (var ii = 0; ii < arr.length; ii++) {
      if (this._decorators[ii] !== arr[ii]) {
        return false;
      }
    }
    return true;
  };
  _proto.getDecorators = function getDecorators() {
    return this._decorators;
  };
  _proto.getDecorations = function getDecorations(block, contentState) {
    var decorations = Array(block.getText().length).fill(null);
    this._decorators.forEach(function (decorator, ii) {
      var counter = 0;
      var strategy = decorator.strategy;
      function getDecorationsChecker(start, end) {
        // Find out if any of our matching range is already occupied
        // by another decorator. If so, discard the match. Otherwise, store
        // the component key for rendering.
        if (canOccupySlice(decorations, start, end)) {
          occupySlice(decorations, start, end, ii + DELIMITER + counter);
          counter++;
        }
      }
      strategy(block, getDecorationsChecker, contentState);
    });
    return List(decorations);
  };
  _proto.getComponentForKey = function getComponentForKey(key) {
    var componentKey = parseInt(key.split(DELIMITER)[0], 10);
    return this._decorators[componentKey].component;
  };
  _proto.getPropsForKey = function getPropsForKey(key) {
    var componentKey = parseInt(key.split(DELIMITER)[0], 10);
    return this._decorators[componentKey].props;
  };
  return CompositeDraftDecorator;
}();
/**
 * Determine whether we can occupy the specified slice of the decorations
 * array.
 */
function canOccupySlice(decorations, start, end) {
  for (var ii = start; ii < end; ii++) {
    if (decorations[ii] != null) {
      return false;
    }
  }
  return true;
}

/**
 * Splice the specified component into our decoration array at the desired
 * range.
 */
function occupySlice(targetArr, start, end, componentKey) {
  for (var ii = start; ii < end; ii++) {
    targetArr[ii] = componentKey;
  }
}
module.exports = CompositeDraftDecorator;