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

var _excluded = ["editorState"],
  _excluded2 = ["editorState"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var cx = require("fbjs/lib/cx");
var React = require("react");
var shallowEqual = require("fbjs/lib/shallowEqual");
/**
 * This component is responsible for rendering placeholder text for the
 * `DraftEditor` component.
 *
 * Override placeholder style via CSS.
 */
var DraftEditorPlaceholder = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DraftEditorPlaceholder, _React$Component);
  function DraftEditorPlaceholder() {
    return _React$Component.apply(this, arguments) || this;
  }
  var _proto = DraftEditorPlaceholder.prototype;
  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var _this$props = this.props,
      editorState = _this$props.editorState,
      otherProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    var nextEditorState = nextProps.editorState,
      nextOtherProps = _objectWithoutPropertiesLoose(nextProps, _excluded2);
    return editorState.getSelection().getHasFocus() !== nextEditorState.getSelection().getHasFocus() || !shallowEqual(otherProps, nextOtherProps);
  };
  _proto.render = function render() {
    var innerClassName =
    // We can't use joinClasses since the fbjs flow definition is wrong. Using
    // cx to concatenate is rising issues with haste internally.
    // eslint-disable-next-line fb-www/cx-concat
    cx('public/DraftEditorPlaceholder/inner') + (this.props.className != null ? " ".concat(this.props.className) : '');
    return /*#__PURE__*/React.createElement("div", {
      "aria-hidden": this.props.ariaHidden,
      className: cx({
        'public/DraftEditorPlaceholder/root': true,
        'public/DraftEditorPlaceholder/hasFocus': this.props.editorState.getSelection().getHasFocus()
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: innerClassName,
      id: this.props.accessibilityID,
      style: {
        whiteSpace: 'pre-wrap'
      }
    }, this.props.text));
  };
  return DraftEditorPlaceholder;
}(React.Component);
module.exports = DraftEditorPlaceholder;