//@exclude
'use strict';
//@endexclude

(function() {


    /**
     * A builder for borrowed management requests.
     *
     * @param {String}  id lender ID.
     *
     * @class
     * @memberOf corbel.Borrow.LenderBuilder
     */
    corbel.Borrow.LenderBuilder = corbel.Services.inherit({

        constructor: function(id) {
            this.id = id;
            this.uri = 'lender';
        },
        /**
         * Create a new Lender
         * @method
         * @memberOf corbel.Borrow.LenderBuilder
         * @param {Object} lender                           The lender data
         * @param {String} lender.id                        The lender name
         * @param {String} lender.borrowPeriod              The borrow period
         * @param {String} lender.freeReturnPeriod          Return without use
         * @param {String} lender.reservationPeriod         Period to apply after wait on queue
         * @param {String} lender.maxConcurrentLoansPerUser Number of loans at same time
         * @param {String} lender.maxLoansPerUserInMonth    Limit number of loans per user
         * @param {Object} lender.maxRenewalsPerResource    Number of times user can renew his loans
         * @param {Object} lender.maxUsersInWaitingQueue    Waiting queue size
         * @param {Object} lender.priority                  RENEW or RESERVE
         * @return {Promise} A promise with the id of the created loanable resources or fails
         *                   with a {@link corbelError}.
         */
        create: function(lender) {
            console.log('borrowInterface.lender.create', lender);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: lender,
            }).then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },
        /**
         * Update a Lender.
         *
         * @method
         * @memberOf corbel.Borrow.LenderBuilder
         *
         * @param {Object} lender   The lender data.
         *
         * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
        */
        update: function(lender) {
            console.log('borrowInterface.lender.update');
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.PUT,
                data: lender
            });
        },
        /**
         * Delete a Lender.
         *
         * @method
         * @memberOf corbel.Borrow.LenderBuilder
         *
         * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
        */
        delete: function() {
            console.log('borrowInterface.lender.delete');
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.DELETE
            });
        },
        /**
         * Get Lender.
         *
         * @method
         * @memberOf corbel.Borrow.LenderBuilder
         *
         * @return {Promise} A promise with lender {Object} or fails with a {@link corbelError}.
         */
        get: function() {
            console.log('borrowInterface.lender.get');
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.GET
            });
        },
        /**
         * Get all Lenders.
         *
         * @method
         * @memberOf corbel.Borrow.LenderBuilder
         *
         * @return {Promise} A promise with all lenders {Object} or fails with a {@link corbelError}.
         */
        getAll: function(params) {
            console.log('borrowInterface.lender.getAll');
            return this.request({
                url: this._buildUri(this.uri, 'all'),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null
            });
        },
        /**
         * Get all reservations by lender.
         *
         * @method
         * @memberOf corbel.Borrow.LenderBuilder
         *
         * @return {Promise} A promise with all reservations {Object} by lender or fails with a {@link corbelError}.
         */
        getAllReservations: function(params) {
            console.log('borrowInterface.lender.getAllReservations');
            return this.request({
                url: this._buildUri(this.uri, 'reservation'),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null
            });
        },

        _buildUri: corbel.Borrow._buildUri
    });
})();
