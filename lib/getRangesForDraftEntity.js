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

var invariant = require("fbjs/lib/invariant");

/**
 * Obtain the start and end positions of the range that has the
 * specified entity applied to it.
 *
 * Entity keys are applied only to contiguous stretches of text, so this
 * method searches for the first instance of the entity key and returns
 * the subsequent range.
 */
function getRangesForDraftEntity(block, key) {
  var ranges = [];
  block.findEntityRanges(function (c) {
    return c.getEntity() === key;
  }, function (start, end) {
    ranges.push({
      start: start,
      end: end
    });
  });
  !!!ranges.length ? process.env.NODE_ENV !== "production" ? invariant(false, 'Entity key not found in this range.') : invariant(false) : void 0;
  return ranges;
}
module.exports = getRangesForDraftEntity;