/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is a fork of DraftEditorBlock.react.js and DraftEditorContents.react.js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 *
 * 
 * @format
 * @oncall draft_js
 */

'use strict';

var _assign = require("object-assign");
function _extends() { _extends = _assign ? _assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var DraftEditorNode = require("./DraftEditorNode.react");
var DraftOffsetKey = require("./DraftOffsetKey");
var Scroll = require("fbjs/lib/Scroll");
var Style = require("fbjs/lib/Style");
var getElementPosition = require("fbjs/lib/getElementPosition");
var getScrollPosition = require("fbjs/lib/getScrollPosition");
var getViewportDimensions = require("fbjs/lib/getViewportDimensions");
var Immutable = require("immutable");
var invariant = require("fbjs/lib/invariant");
var isHTMLElement = require("./isHTMLElement");
var React = require("react");
var SCROLL_BUFFER = 10;
var List = Immutable.List;

// we should harden up the below flow types to make them more strict

/**
 * Return whether a block overlaps with either edge of the `SelectionState`.
 */
var isBlockOnSelectionEdge = function isBlockOnSelectionEdge(selection, key) {
  return selection.getAnchorKey() === key || selection.getFocusKey() === key;
};

/**
 * We will use this helper to identify blocks that need to be wrapped but have siblings that
 * also share the same wrapper element, this way we can do the wrapping once the last sibling
 * is added.
 */
var shouldNotAddWrapperElement = function shouldNotAddWrapperElement(block, contentState) {
  var nextSiblingKey = block.getNextSiblingKey();
  return nextSiblingKey ? contentState.getBlockForKey(nextSiblingKey).getType() === block.getType() : false;
};
var applyWrapperElementToSiblings = function applyWrapperElementToSiblings(wrapperTemplate, Element, nodes) {
  var wrappedSiblings = [];

  // we check back until we find a sibling that does not have same wrapper
  var _iterator = _createForOfIteratorHelper(nodes.reverse()),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var sibling = _step.value;
      if (sibling.type !== Element) {
        break;
      }
      wrappedSiblings.push(sibling);
    }

    // we now should remove from acc the wrappedSiblings and add them back under same wrap
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  nodes.splice(nodes.indexOf(wrappedSiblings[0]), wrappedSiblings.length + 1);
  var childrenIs = wrappedSiblings.reverse();
  var key = childrenIs[0].key;
  nodes.push(React.cloneElement(wrapperTemplate, {
    key: "".concat(key, "-wrap"),
    'data-offset-key': DraftOffsetKey.encode(key, 0, 0)
  }, childrenIs));
  return nodes;
};
var getDraftRenderConfig = function getDraftRenderConfig(block, blockRenderMap) {
  var configForType = blockRenderMap.get(block.getType()) || blockRenderMap.get('unstyled');
  var wrapperTemplate = configForType.wrapper;
  var Element = configForType.element || blockRenderMap.get('unstyled').element;
  return {
    Element: Element,
    wrapperTemplate: wrapperTemplate
  };
};
var getCustomRenderConfig = function getCustomRenderConfig(block, blockRendererFn) {
  var customRenderer = blockRendererFn(block);
  if (!customRenderer) {
    return {};
  }
  var CustomComponent = customRenderer.component,
    customProps = customRenderer.props,
    customEditable = customRenderer.editable;
  return {
    CustomComponent: CustomComponent,
    customProps: customProps,
    customEditable: customEditable
  };
};
var getElementPropsConfig = function getElementPropsConfig(block, editorKey, offsetKey, blockStyleFn, customConfig, ref) {
  var elementProps = {
    'data-block': true,
    'data-editor': editorKey,
    'data-offset-key': offsetKey,
    key: block.getKey(),
    ref: ref
  };
  var customClass = blockStyleFn(block);
  if (customClass) {
    elementProps.className = customClass;
  }
  if (customConfig.customEditable !== undefined) {
    elementProps = _objectSpread(_objectSpread({}, elementProps), {}, {
      contentEditable: customConfig.customEditable,
      suppressContentEditableWarning: true
    });
  }
  return elementProps;
};
var DraftEditorBlockNode = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorBlockNode, _React$Component);
  function DraftEditorBlockNode() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _defineProperty(_assertThisInitialized(_this), "wrapperRef", React.createRef());
    return _this;
  }
  var _proto = DraftEditorBlockNode.prototype;
  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var _this$props = this.props,
      block = _this$props.block,
      direction = _this$props.direction,
      tree = _this$props.tree;
    var isContainerNode = !block.getChildKeys().isEmpty();
    var blockHasChanged = block !== nextProps.block || tree !== nextProps.tree || direction !== nextProps.direction || isBlockOnSelectionEdge(nextProps.selection, nextProps.block.getKey()) && nextProps.forceSelection;

    // if we have children at this stage we always re-render container nodes
    // else if its a root node we avoid re-rendering by checking for block updates
    return isContainerNode || blockHasChanged;
  }

  /**
   * When a block is mounted and overlaps the selection state, we need to make
   * sure that the cursor is visible to match native behavior. This may not
   * be the case if the user has pressed `RETURN` or pasted some content, since
   * programatically creating these new blocks and setting the DOM selection
   * will miss out on the browser natively scrolling to that position.
   *
   * To replicate native behavior, if the block overlaps the selection state
   * on mount, force the scroll position. Check the scroll state of the scroll
   * parent, and adjust it to align the entire block to the bottom of the
   * scroll parent.
   */;
  _proto.componentDidMount = function componentDidMount() {
    var selection = this.props.selection;
    var endKey = selection.getEndKey();
    if (!selection.getHasFocus() || endKey !== this.props.block.getKey()) {
      return;
    }
    var blockNode = this.wrapperRef.current;
    if (!blockNode) {
      // This Block Node was rendered without a wrapper element.
      return;
    }
    var scrollParent = Style.getScrollParent(blockNode);
    var scrollPosition = getScrollPosition(scrollParent);
    var scrollDelta;
    if (scrollParent === window) {
      var nodePosition = getElementPosition(blockNode);
      var nodeBottom = nodePosition.y + nodePosition.height;
      var viewportHeight = getViewportDimensions().height;
      scrollDelta = nodeBottom - viewportHeight;
      if (scrollDelta > 0) {
        window.scrollTo(scrollPosition.x, scrollPosition.y + scrollDelta + SCROLL_BUFFER);
      }
    } else {
      !isHTMLElement(blockNode) ? process.env.NODE_ENV !== "production" ? invariant(false, 'blockNode is not an HTMLElement') : invariant(false) : void 0;
      var htmlBlockNode = blockNode;
      var blockBottom = htmlBlockNode.offsetHeight + htmlBlockNode.offsetTop;
      var scrollBottom = scrollParent.offsetHeight + scrollPosition.y;
      scrollDelta = blockBottom - scrollBottom;
      if (scrollDelta > 0) {
        Scroll.setTop(scrollParent, Scroll.getTop(scrollParent) + scrollDelta + SCROLL_BUFFER);
      }
    }
  };
  _proto.render = function render() {
    var _this2 = this;
    var _this$props2 = this.props,
      block = _this$props2.block,
      blockRenderMap = _this$props2.blockRenderMap,
      blockRendererFn = _this$props2.blockRendererFn,
      blockStyleFn = _this$props2.blockStyleFn,
      contentState = _this$props2.contentState,
      decorator = _this$props2.decorator,
      editorKey = _this$props2.editorKey,
      editorState = _this$props2.editorState,
      customStyleFn = _this$props2.customStyleFn,
      customStyleMap = _this$props2.customStyleMap,
      direction = _this$props2.direction,
      forceSelection = _this$props2.forceSelection,
      selection = _this$props2.selection,
      tree = _this$props2.tree;
    var children = null;
    if (block.children.size) {
      children = block.children.reduce(function (acc, key) {
        var offsetKey = DraftOffsetKey.encode(key, 0, 0);
        var child = contentState.getBlockForKey(key);
        var customConfig = getCustomRenderConfig(child, blockRendererFn);
        var Component = customConfig.CustomComponent || DraftEditorBlockNode;
        var _getDraftRenderConfig = getDraftRenderConfig(child, blockRenderMap),
          Element = _getDraftRenderConfig.Element,
          wrapperTemplate = _getDraftRenderConfig.wrapperTemplate;
        var elementProps = getElementPropsConfig(child, editorKey, offsetKey, blockStyleFn, customConfig, null);
        var childProps = _objectSpread(_objectSpread({}, _this2.props), {}, {
          tree: editorState.getBlockTree(key),
          blockProps: customConfig.customProps,
          offsetKey: offsetKey,
          block: child
        });
        acc.push(React.createElement(Element, elementProps, /*#__PURE__*/React.createElement(Component, childProps)));
        if (!wrapperTemplate || shouldNotAddWrapperElement(child, contentState)) {
          return acc;
        }

        // if we are here it means we are the last block
        // that has a wrapperTemplate so we should wrap itself
        // and all other previous siblings that share the same wrapper
        applyWrapperElementToSiblings(wrapperTemplate, Element, acc);
        return acc;
      }, []);
    }
    var blockKey = block.getKey();
    var offsetKey = DraftOffsetKey.encode(blockKey, 0, 0);
    var customConfig = getCustomRenderConfig(block, blockRendererFn);
    var Component = customConfig.CustomComponent;
    var blockNode = Component != null ? /*#__PURE__*/React.createElement(Component, _extends({}, this.props, {
      tree: editorState.getBlockTree(blockKey),
      blockProps: customConfig.customProps,
      offsetKey: offsetKey,
      block: block
    })) : /*#__PURE__*/React.createElement(DraftEditorNode, {
      block: block,
      children: children,
      contentState: contentState,
      customStyleFn: customStyleFn,
      customStyleMap: customStyleMap,
      decorator: decorator,
      direction: direction,
      forceSelection: forceSelection,
      hasSelection: isBlockOnSelectionEdge(selection, blockKey),
      selection: selection,
      tree: tree
    });
    if (block.getParentKey()) {
      return blockNode;
    }
    var _getDraftRenderConfig2 = getDraftRenderConfig(block, blockRenderMap),
      Element = _getDraftRenderConfig2.Element;
    var elementProps = getElementPropsConfig(block, editorKey, offsetKey, blockStyleFn, customConfig, this.wrapperRef);

    // root block nodes needs to be wrapped
    return React.createElement(Element, elementProps, blockNode);
  };
  return DraftEditorBlockNode;
}(React.Component);
module.exports = DraftEditorBlockNode;