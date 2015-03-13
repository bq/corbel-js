 (function() {
     //@exclude
     'use strict';
     /*globals corbel */
     //@endexclude

     /**
      * Relation
      * @class
      * @memberOf Resources
      * @param  {String} srcType     The source resource type
      * @param  {String} srcId       The source resource id
      * @param  {String} destType    The destination resource type
      */
     corbel.Resources.Relation = corbel.Resources.ResourceBase.extend({
         constructor: function(srcType, srcId, destType, driver) {
             this.type = srcType;
             this.srcId = srcId;
             this.destType = destType;
             this.driver = driver;
         },
         /**
          * Gets the resources of a relation
          * @method
          * @memberOf resources.RelationBuilder
          * @param  {Object} params      Params of the silkroad request
          * @param  {String} dataType    Mime type of the expected resource
          * @param  {String} uri         Relationed resource
          * @return {Promise}            ES6 promise that resolves to a relation {Object} or rejects with a {@link SilkRoadError}
          * @see {@link corbel.util.serializeParams} to see a example of the params
          */
         get: function(params, dataType, destId) {
             // console.log('resourceInterface.relation.get', params);
             return this.request({
                 url: this.buildUri(this.type, this.srcId, this.destType, destId),
                 method: corbel.services.method.GET,
                 query: params ? corbel.util.serializeParams(params) : null,
                 Accept: dataType
             });
         },
         /**
          * Adds a new relation between Resources
          * @method
          * @memberOf Resources.RelationBuilder
          * @param  {String} uri          Relationed resource
          * @param  {Object} relationData Additional data to be added to the relation (in json)
          * @return {Promise}             ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
          * @example uri = '555'
          */
         add: function(destId, relationData) {
             // console.log('resourceInterface.relation.add', relationData);
             return this.request({
                 url: this.buildUri(this.type, this.srcId, this.destType, destId),
                 contentType: 'application/json',
                 data: relationData,
                 method: corbel.services.method.PUT
             });
         },
         /**
          * Adds a new relation between Resources
          * @method
          * @memberOf Resources.RelationBuilder
          * @param  {Integer} pos          The new position
          * @return {Promise}              ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
          */
         move: function(destId, pos) {
             // console.log('resourceInterface.relation.move', pos);
             return this.request({
                 url: this.buildUri(this.type, this.srcId, this.destType, destId),
                 contentType: 'application/json',
                 data: {
                     '_order': '$pos(' + pos + ')'
                 },
                 method: corbel.services.method.PUT
             });
         },
         /**
          * Deletes a relation between Resources
          * @method
          * @memberOf Resources.RelationBuilder
          * @param  {String} destId          Relationed resource
          * @return {Promise}                ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
          * @example
          * destId = 'music:Track/555'
          */
         delete: function(destId) {
             // console.log('resourceInterface.relation.delete', destId);
             return this.request({
                 url: this.buildUri(this.type, this.srcId, this.destType, destId),
                 method: corbel.services.method.DELETE
             });
         }
     });


     return corbel.Resources.Relation;

 })();