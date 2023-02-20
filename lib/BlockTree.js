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

var _excluded = ["leaves"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var findRangesImmutable = require("./findRangesImmutable");
var getOwnObjectValues = require("./getOwnObjectValues");
var Immutable = require("immutable");
var List = Immutable.List,
  Repeat = Immutable.Repeat,
  Record = Immutable.Record;
var returnTrue = function returnTrue() {
  return true;
};
var defaultLeafRange = {
  start: null,
  end: null
};
var LeafRange = Record(defaultLeafRange);
var defaultDecoratorRange = {
  start: null,
  end: null,
  decoratorKey: null,
  leaves: null
};
var DecoratorRange = Record(defaultDecoratorRange);
var BlockTree = {
  /**
   * Generate a block tree for a given ContentBlock/decorator pair.
   */
  generate: function generate(contentState, block, decorator
  // $FlowFixMe[value-as-type]
  ) {
    var textLength = block.getLength();
    if (!textLength) {
      return List.of(new DecoratorRange({
        start: 0,
        end: 0,
        decoratorKey: null,
        leaves: List.of(new LeafRange({
          start: 0,
          end: 0
        }))
      }));
    }
    var leafSets = [];
    var decorations = decorator ? decorator.getDecorations(block, contentState) : List(Repeat(null, textLength));
    var chars = block.getCharacterList();
    findRangesImmutable(decorations, areEqual, returnTrue, function (start, end) {
      leafSets.push(new DecoratorRange({
        start: start,
        end: end,
        decoratorKey: decorations.get(start),
        leaves: generateLeaves(chars.slice(start, end).toList(), start)
      }));
    });
    return List(leafSets);
  },
  // $FlowFixMe[value-as-type]
  fromJS: function fromJS(_ref) {
    var leaves = _ref.leaves,
      other = _objectWithoutPropertiesLoose(_ref, _excluded);
    return new DecoratorRange(_objectSpread(_objectSpread({}, other), {}, {
      leaves: leaves != null ? List(Array.isArray(leaves) ? leaves : getOwnObjectValues(leaves)).map(function (leaf) {
        return LeafRange(leaf);
      }) : null
    }));
  }
};

/**
 * Generate LeafRange records for a given character list.
 */
function generateLeaves(characters, offset
// $FlowFixMe[value-as-type]
) {
  var leaves = [];
  var inlineStyles = characters.map(function (c) {
    return c.getStyle();
  }).toList();
  findRangesImmutable(inlineStyles, areEqual, returnTrue, function (start, end) {
    leaves.push(new LeafRange({
      start: start + offset,
      end: end + offset
    }));
  });
  return List(leaves);
}
function areEqual(a, b) {
  return a === b;
}
module.exports = BlockTree;