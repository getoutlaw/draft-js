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
var BlockMapBuilder = require("./BlockMapBuilder");
var CharacterMetadata = require("./CharacterMetadata");
var ContentBlock = require("./ContentBlock");
var ContentBlockNode = require("./ContentBlockNode");
var DraftModifier = require("./DraftModifier");
var EditorState = require("./EditorState");
var generateRandomKey = require("./generateRandomKey");
var gkx = require("./gkx");
var Immutable = require("immutable");
var moveBlockInContentState = require("./moveBlockInContentState");
var experimentalTreeDataSupport = gkx('draft_tree_data_support');
var ContentBlockRecord = experimentalTreeDataSupport ? ContentBlockNode : ContentBlock;
var List = Immutable.List,
  Repeat = Immutable.Repeat;
var AtomicBlockUtils = {
  insertAtomicBlock: function insertAtomicBlock(editorState, entityKey, character) {
    var contentState = editorState.getCurrentContent();
    var selectionState = editorState.getSelection();
    var afterRemoval = DraftModifier.removeRange(contentState, selectionState, 'backward');
    var targetSelection = afterRemoval.getSelectionAfter();
    var afterSplit = DraftModifier.splitBlock(afterRemoval, targetSelection);
    var insertionTarget = afterSplit.getSelectionAfter();
    var asAtomicBlock = DraftModifier.setBlockType(afterSplit, insertionTarget, 'atomic');
    var charData = CharacterMetadata.create({
      entity: entityKey
    });
    var atomicBlockConfig = {
      key: generateRandomKey(),
      type: 'atomic',
      text: character,
      characterList: List(Repeat(charData, character.length))
    };
    var atomicDividerBlockConfig = {
      key: generateRandomKey(),
      type: 'unstyled'
    };
    if (experimentalTreeDataSupport) {
      atomicBlockConfig = _objectSpread(_objectSpread({}, atomicBlockConfig), {}, {
        nextSibling: atomicDividerBlockConfig.key
      });
      atomicDividerBlockConfig = _objectSpread(_objectSpread({}, atomicDividerBlockConfig), {}, {
        prevSibling: atomicBlockConfig.key
      });
    }
    var fragmentArray = [new ContentBlockRecord(atomicBlockConfig), new ContentBlockRecord(atomicDividerBlockConfig)];
    var fragment = BlockMapBuilder.createFromArray(fragmentArray);
    var withAtomicBlock = DraftModifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);
    var newContent = withAtomicBlock.merge({
      selectionBefore: selectionState,
      selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true)
    });
    return EditorState.push(editorState, newContent, 'insert-fragment');
  },
  moveAtomicBlock: function moveAtomicBlock(editorState, atomicBlock, targetRange, insertionMode) {
    var contentState = editorState.getCurrentContent();
    var selectionState = editorState.getSelection();
    var withMovedAtomicBlock;
    if (insertionMode === 'before' || insertionMode === 'after') {
      var targetBlock = contentState.getBlockForKey(insertionMode === 'before' ? targetRange.getStartKey() : targetRange.getEndKey());
      withMovedAtomicBlock = moveBlockInContentState(contentState, atomicBlock, targetBlock, insertionMode);
    } else {
      var afterRemoval = DraftModifier.removeRange(contentState, targetRange, 'backward');
      var selectionAfterRemoval = afterRemoval.getSelectionAfter();
      var _targetBlock = afterRemoval.getBlockForKey(selectionAfterRemoval.getFocusKey());
      if (selectionAfterRemoval.getStartOffset() === 0) {
        withMovedAtomicBlock = moveBlockInContentState(afterRemoval, atomicBlock, _targetBlock, 'before');
      } else if (selectionAfterRemoval.getEndOffset() === _targetBlock.getLength()) {
        withMovedAtomicBlock = moveBlockInContentState(afterRemoval, atomicBlock, _targetBlock, 'after');
      } else {
        var afterSplit = DraftModifier.splitBlock(afterRemoval, selectionAfterRemoval);
        var selectionAfterSplit = afterSplit.getSelectionAfter();
        var _targetBlock2 = afterSplit.getBlockForKey(selectionAfterSplit.getFocusKey());
        withMovedAtomicBlock = moveBlockInContentState(afterSplit, atomicBlock, _targetBlock2, 'before');
      }
    }
    var newContent = withMovedAtomicBlock.merge({
      selectionBefore: selectionState,
      selectionAfter: withMovedAtomicBlock.getSelectionAfter().set('hasFocus', true)
    });
    return EditorState.push(editorState, newContent, 'move-block');
  }
};
module.exports = AtomicBlockUtils;