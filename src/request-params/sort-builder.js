// @exclude
'use strict'
// @endexclude
/* global corbel */

var sortBuilder = (function () {
  var sortBuilder = {}

  /**
   * Sets ascending direction to sort param
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  sortBuilder.asc = function (field) {
    this.params.sort = this.params.sort || {}
    this.params.sort[field] = corbel.Resources.sort.ASC
    return this
  }

  /**
   * Sets descending direction to sort param
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  sortBuilder.desc = function (field) {
    this.params.sort = this.params.sort || {}
    this.params.sort[field] = corbel.Resources.sort.DESC
    return this
  }

  return sortBuilder
})()
