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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var BlockMapBuilder = require("./BlockMapBuilder");
var CharacterMetadata = require("./CharacterMetadata");
var ContentBlock = require("./ContentBlock");
var ContentBlockNode = require("./ContentBlockNode");
var DraftEntity = require("./DraftEntity");
var SelectionState = require("./SelectionState");
var generateRandomKey = require("./generateRandomKey");
var getOwnObjectValues = require("./getOwnObjectValues");
var gkx = require("./gkx");
var Immutable = require("immutable");
var sanitizeDraftText = require("./sanitizeDraftText");
var List = Immutable.List,
  Record = Immutable.Record,
  Repeat = Immutable.Repeat,
  ImmutableMap = Immutable.Map,
  OrderedMap = Immutable.OrderedMap;
var defaultRecord = {
  entityMap: null,
  blockMap: null,
  selectionBefore: null,
  selectionAfter: null
};

// Immutable 3 typedefs are not good, so ContentState ends up
// subclassing `any`. Define a rudimentary type for the
// supercalss here instead.

var ContentStateRecord = Record(defaultRecord);

/* $FlowFixMe[signature-verification-failure] Supressing a `signature-
 * verification-failure` error here. TODO: T65949050 Clean up the branch for
 * this GK */
var ContentBlockNodeRecord = gkx('draft_tree_data_support') ? ContentBlockNode : ContentBlock;
var ContentState = /*#__PURE__*/function (_ContentStateRecord) {
  _inheritsLoose(ContentState, _ContentStateRecord);
  function ContentState() {
    return _ContentStateRecord.apply(this, arguments) || this;
  }
  var _proto = ContentState.prototype;
  _proto.getEntityMap = function getEntityMap() {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity;
  };
  _proto.getBlockMap = function getBlockMap() {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.get('blockMap');
  };
  _proto.getSelectionBefore = function getSelectionBefore() {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.get('selectionBefore');
  };
  _proto.getSelectionAfter = function getSelectionAfter() {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.get('selectionAfter');
  };
  _proto.getBlockForKey = function getBlockForKey(key) {
    var block = this.getBlockMap().get(key);
    return block;
  };
  _proto.getKeyBefore = function getKeyBefore(key) {
    return this.getBlockMap().reverse().keySeq().skipUntil(function (v) {
      return v === key;
    }).skip(1).first();
  };
  _proto.getKeyAfter = function getKeyAfter(key) {
    return this.getBlockMap().keySeq().skipUntil(function (v) {
      return v === key;
    }).skip(1).first();
  };
  _proto.getBlockAfter = function getBlockAfter(key) {
    return this.getBlockMap().skipUntil(function (_, k) {
      return k === key;
    }).skip(1).first();
  };
  _proto.getBlockBefore = function getBlockBefore(key) {
    return this.getBlockMap().reverse().skipUntil(function (_, k) {
      return k === key;
    }).skip(1).first();
  };
  _proto.getBlocksAsArray = function getBlocksAsArray() {
    return this.getBlockMap().toArray();
  };
  _proto.getFirstBlock = function getFirstBlock() {
    return this.getBlockMap().first();
  };
  _proto.getLastBlock = function getLastBlock() {
    return this.getBlockMap().last();
  };
  _proto.getPlainText = function getPlainText(delimiter) {
    return this.getBlockMap().map(function (block) {
      return block ? block.getText() : '';
    }).join(delimiter || '\n');
  };
  _proto.getLastCreatedEntityKey = function getLastCreatedEntityKey() {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity.__getLastCreatedEntityKey();
  };
  _proto.hasText = function hasText() {
    var blockMap = this.getBlockMap();
    return blockMap.size > 1 ||
    // make sure that there are no zero width space chars
    escape(blockMap.first().getText()).replace(/%u200B/g, '').length > 0;
  };
  _proto.createEntity = function createEntity(type, mutability, data) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__create(type, mutability, data);
    return this;
  };
  _proto.mergeEntityData = function mergeEntityData(key, toMerge) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__mergeData(key, toMerge);
    return this;
  };
  _proto.replaceEntityData = function replaceEntityData(key, newData) {
    // TODO: update this when we fully remove DraftEntity
    /* $FlowFixMe[class-object-subtyping] added when improving typing for this
     * parameters */
    DraftEntity.__replaceData(key, newData);
    return this;
  };
  _proto.addEntity = function addEntity(instance) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__add(instance);
    return this;
  };
  _proto.getEntity = function getEntity(key) {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity.__get(key);
  };
  _proto.getAllEntities = function getAllEntities() {
    return DraftEntity.__getAll();
  };
  _proto.setEntityMap = function setEntityMap(entityMap) {
    DraftEntity.__loadWithEntities(entityMap);
    return this;
  };
  ContentState.mergeEntityMaps = function mergeEntityMaps(to, from) {
    return to.merge(from.__getAll());
  }

  // TODO: when EntityMap is moved into content state this and `setEntityMap`
  // Will be the exact same. Merge them then.
  ;
  _proto.replaceEntityMap = function replaceEntityMap(entityMap) {
    return this.setEntityMap(entityMap.__getAll());
  };
  _proto.setSelectionBefore = function setSelectionBefore(selection) {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.set('selectionBefore', selection);
  };
  _proto.setSelectionAfter = function setSelectionAfter(selection) {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.set('selectionAfter', selection);
  };
  _proto.setBlockMap = function setBlockMap(blockMap) {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.set('blockMap', blockMap);
  };
  ContentState.createFromBlockArray = function createFromBlockArray(
  // TODO: update flow type when we completely deprecate the old entity API
  blocks, entityMap) {
    // TODO: remove this when we completely deprecate the old entity API
    var theBlocks = Array.isArray(blocks) ? blocks : blocks.contentBlocks;
    var blockMap = BlockMapBuilder.createFromArray(theBlocks);
    var selectionState = blockMap.isEmpty() ? new SelectionState() : SelectionState.createEmpty(blockMap.first().getKey());
    return new ContentState({
      blockMap: blockMap,
      entityMap: entityMap || DraftEntity,
      selectionBefore: selectionState,
      selectionAfter: selectionState
    });
  };
  ContentState.createFromText = function createFromText(text) {
    var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /\r\n?|\n/g;
    var strings = text.split(delimiter);
    var blocks = strings.map(function (block) {
      block = sanitizeDraftText(block);
      return new ContentBlockNodeRecord({
        key: generateRandomKey(),
        text: block,
        type: 'unstyled',
        characterList: List(Repeat(CharacterMetadata.EMPTY, block.length))
      });
    });
    return ContentState.createFromBlockArray(blocks);
  };
  ContentState.fromJS = function fromJS(state) {
    return new ContentState(_objectSpread(_objectSpread({}, state), {}, {
      blockMap: OrderedMap(state.blockMap).map(
      // $FlowFixMe[method-unbinding]
      ContentState.createContentBlockFromJS),
      selectionBefore: new SelectionState(state.selectionBefore),
      selectionAfter: new SelectionState(state.selectionAfter)
    }));
  };
  ContentState.createContentBlockFromJS = function createContentBlockFromJS(block) {
    var characterList = block.characterList;
    return new ContentBlockNodeRecord(_objectSpread(_objectSpread({}, block), {}, {
      data: ImmutableMap(block.data),
      characterList: characterList != null ? List((Array.isArray(characterList) ? characterList : getOwnObjectValues(characterList)).map(function (c) {
        return CharacterMetadata.fromJS(c);
      })) : undefined
    }));
  };
  return ContentState;
}(ContentStateRecord);
module.exports = ContentState;