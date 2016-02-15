// @exclude
'use strict'
// @endexclude

var queryBuilder = (function () {
  var queryBuilder = {}

  /**
   * Adds an Equal criteria to query
   * @param  {String} field
   * @param  {String | Number | Date} value
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.eq = function (field, value) {
    this.addCriteria('$eq', field, value)
    return this
  }

  /**
   * Adds a Greater Than criteria to query
   * @param  {String} field
   * @param  {String | Number | Date} value
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.gt = function (field, value) {
    this.addCriteria('$gt', field, value)
    return this
  }

  /**
   * Adds a Greater Than Or Equal criteria to query
   * @param  {String} field
   * @param  {String | Number | Date} value
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.gte = function (field, value) {
    this.addCriteria('$gte', field, value)
    return this
  }

  /**
   * Adds a Less Than criteria to query
   * @param  {String} field
   * @param  {String | Number | Date} value
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.lt = function (field, value) {
    this.addCriteria('$lt', field, value)
    return this
  }

  /**
   * Adds a Less Than Or Equal criteria to query
   * @param  {String} field
   * @param  {String | Number | Date} value
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.lte = function (field, value) {
    this.addCriteria('$lte', field, value)
    return this
  }

  /**
   * Adds a Not Equal criteria to query
   * @param  {String} field
   * @param  {String | Number | Date} value
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.ne = function (field, value) {
    this.addCriteria('$ne', field, value)
    return this
  }

  /**
   * Adds a Like criteria to query
   * @param  {String} field
   * @param  {String | Number | Date} value
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.like = function (field, value) {
    this.addCriteria('$like', field, value)
    return this
  }

  /**
   * Adds an In criteria to query
   * @param  {String} field
   * @param  {String[]|Number[]|Date[]} values
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.in = function (field, values) {
    this.addCriteria('$in', field, values)
    return this
  }

  /**
   * Adds an All criteria to query
   * @param  {String} field
   * @param  {String[]|Number[]|Date[]} values
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.all = function (field, values) {
    this.addCriteria('$all', field, values)
    return this
  }

  /**
   * Adds an Element Match criteria to query
   * @param  {String} field
   * @param  {JSON} value Query for the matching
   * @return {RequestParamsBuilder} RequestParamsBuilder
   */
  queryBuilder.elemMatch = function (field, query) {
    this.addCriteria('$elem_match', field, query)
    return this
  }

  /**
   * Sets an specific queryDomain, by default 'api'.
   * @param {String} queryDomain query domain name, 'api' and '7digital' supported
   */
  queryBuilder.setQueryDomain = function (queryDomain) {
    this.params.queryDomain = queryDomain
    return this
  }

  queryBuilder.addCriteria = function (operator, field, value) {
    var criteria = {}
    criteria[operator] = {}
    criteria[operator][field] = value
    this.params.query = this.params.query || []
    this.params.query.push(criteria)
    return this
  }

  return queryBuilder
})()
