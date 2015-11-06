//@exclude
'use strict';
//@endexclude

(function() {


    /**
     * A builder for borrowed management requests.
     *
     * @param {String}  id resource ID.
     *
     * @class
     * @memberOf corbel.Borrow.BorrowBuilder
     */
     corbel.Borrow.BorrowBuilder = corbel.Services.inherit({

        constructor: function(id) {
            this.id = id;
            this.uri = 'resource';
        },
        /**
         * Adds the loanable resource.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param {Object}   loanable resource                          The loanable resource data.
         * @param {String}   loanableResource.resourceId                Identifier of resource
         * @param {Object[]} loanableResource.licenses                  Licenses list
         * @param {number}   loanableResource.licenses[].availableUses  Amount of uses that the resource is available
         * @param {number}   loanableResource.licenses[].availableLoans Amount of concurrent loans are available for the resource
         * @param {timestamp}loanableResource.licenses[].expire         Expire date
         * @param {timestamp}loanableResource.licenses[].start          Start date
         * @param {Object}   loanableResource.asset                     Asigned to the resource
         * @param {String[]} loanableResource.asset.scopes              Scope list
         * @param {String}   loanableResource.asset.name                Asset name
         *
         * @return {Promise} A promise with the id of the created loanable resources or fails
         *                   with a {@link corbelError}.
         */
        add: function(loanableResource) {
            console.log('borrowInterface.resource.add', loanableResource);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: loanableResource
            }).then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },
        /**
         * Get a loanable resource.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @return {Promise} A promise with loanable resource {Object} or fails with a {@link corbelError}.
         */
        get: function() {
            console.log('borrowInterface.resource.get');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri ,this.id),
                method: corbel.request.method.GET
            });
        },
        /**
         * Delete a loanable resource.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @return {Promise} A promise  resolves to undefined (void) or fails with a {@link corbelError}.
         */
        delete: function() {
            console.log('borrowInterface.resource.delete');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.DELETE
            });
        },
        /**
         * Add license to loanable resource.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param {Object} data   licenses data.
         * @param {Object} license                 The license data.
         * @param {String} license.resourceId      Identifier of resource
         * @param {number} licensee.availableUses  Amount of uses that the resource is available
         * @param {number} license.availableLoans  Amount of concurrent loans are available for the resource
         * @param {timestamp} license.expire       Expire date
         * @param {timestamp} licensee.start       Start date
         * @param {String} license.asset           Asigned to the resource

         * @return {Promise} A promise with the id of the created a license or fails
         *                   with a {@link corbelError}.
         */
        addLicense: function(license) {
            console.log('borrowInterface.resource.addLicense', license);
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id, 'license'),
                method: corbel.request.method.POST,
                data: license
            }).then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },
        /**
         * Apply loan.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param {String} userId    user id.
         *
         * @return {Promise} A promise  resolves to undefined (void) or fails with a {@link corbelError}.
         */
        applyFor: function(userId) {
            console.log('borrowInterface.resource.applyFor', userId);
            corbel.validate.values(['id', 'userId'], {
                'id': this.id,
                'userId': userId
            });
            return this.request({
                url: this._buildUri(this.uri, this.id, 'loan/' + userId),
                method: corbel.request.method.PUT
            });
        },
        /**
         * Apply loan for user logged.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @return {Promise} A promise  resolves to undefined (void) or fails with a {@link corbelError}.
         */
        applyForMe: function() {
            console.log('borrowInterface.resource.applyForMe');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id, 'loan/me'),
                method: corbel.request.method.PUT
            });
        },
        /**
         * Get lent.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param {String} userId    user id.
         *
         * @return {Promise} A promise with user lents {Object} or fails with a {@link corbelError}.
         */
        getLentOf: function(userId) {
            console.log('borrowInterface.resource.getLentOf', userId);
            corbel.validate.values(['id', 'userId'], {
                'id': this.id,
                'userId': userId
            });
            return this.request({
                url: this._buildUri(this.uri, this.id, 'loan/' + userId),
                method: corbel.request.method.GET
            });
        },
        /**
         * Get lent of user logged.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         * @return {Promise} A promise with user logged lents {Object} or fails with a {@link corbelError}.
         */
        getMyLent: function() {
            console.log('borrowInterface.resource.getMyLent');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id, 'loan/me'),
                method: corbel.request.method.GET
            });
        },
        /**
         * Return lent.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param {String} userId    user id.
         *
         * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
         */
        returnLoanOf: function(userId) {
            console.log('borrowInterface.resource.returnLoanOf', userId);
            corbel.validate.values(['id', 'userId'], {
                'id': this.id,
                'userId': userId
            });
            return this.request({
                url: this._buildUri(this.uri, this.id, 'loan/' + userId),
                method: corbel.request.method.DELETE
            });
        },
        /**
         * Return loan of user logged.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
        */
        returnMyLoan: function() {
            console.log('borrowInterface.resource.returnMyLoan');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id, 'loan/me'),
                method: corbel.request.method.DELETE
            });
        },
        /**
         * Renew loan.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param  {String} userId    The userId
         *
         * @return {Promise} A promise  resolves to undefined (void) or fails with a {@link corbelError}.
         */
        renewFor: function(userId) {
            console.log('borrowInterface.resource.renewFor', userId);
            corbel.validate.values(['id', 'userId'], {
                'id': this.id,
                'userId': userId
            });
            return this.request({
                url: this._buildUri(this.uri, this.id, 'renewal/' + userId),
                method: corbel.request.method.PUT
            });
        },
        /**
         * Renew loan for user logged.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @return {Promise} A promise  resolves to undefined (void) or fails with a {@link corbelError}.
         */
        renewForMe: function() {
            console.log('borrowInterface.resource.renewForMe');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id, 'renewal/me'),
                method: corbel.request.method.PUT
            });
        },
        /**
         * Reserve a resource.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param  {String} userId    The userId
         *
         * @return {Promise} A promise  resolves to undefined (void) or fails with a {@link corbelError}.
         */
        reserveFor: function(userId) {
            console.log('borrowInterface.resource.reserveFor', userId);
            corbel.validate.values(['id', 'userId'], {
                'id': this.id,
                'userId': userId
            });
            return this.request({
                url: this._buildUri(this.uri, this.id, 'reservation/' + userId),
                method: corbel.request.method.PUT
            });
        },
        /**
         * Reserve a resource for user logged.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
         */
        reserveForMe: function() {
            console.log('borrowInterface.resource.reserveForMe');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id, 'reservation/me'),
                method: corbel.request.method.PUT
            });
        },
         /**
         * Cancel reservation.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param {String} userId    user id.
         *
         * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
         */
        cancelReservationFor: function(userId) {
            console.log('borrowInterface.resource.cancelReservationFor', userId);
            corbel.validate.values(['id', 'userId'], {
                'id': this.id,
                'userId': userId
            });
            return this.request({
                url: this._buildUri(this.uri, this.id, 'reservation/' + userId),
                method: corbel.request.method.DELETE
            });
        },
        /**
         * Cancel reservation for user logged.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
        */
        cancelMyReservation: function() {
            console.log('borrowInterface.resource.cancelMyReservation');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id, 'reservation/me'),
                method: corbel.request.method.DELETE
            });
        },
        /**
         * get the user borrowed history.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @param {String} userId    user id.
         *
         * @return {Promise} A promise with user borowed {Object} history or fails with a {@link corbelError}.
         */
        getHistoryOf: function(userId) {
            console.log('borrowInterface.resource.getHistoryOf', userId);
            corbel.validate.value('userId', userId);
            return this.request({
                url: this._buildUri(this.uri, 'history/' + userId),
                method: corbel.request.method.GET
            });
        },
        /**
         * Get lent of user logged.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         * @return {Promise} A promise with user logged borrowed {Object} history or fails with a {@link corbelError}.
         */
        getMyHistory: function() {
            console.log('borrowInterface.resource.getMyHistory');
            return this.request({
                url: this._buildUri(this.uri, 'history/me'),
                method: corbel.request.method.GET
            });
        },
        /**
         * get full resources borrowed history.
         *
         * @method
         * @memberOf corbel.Borrow.BorrowBuilder
         *
         * @return {Promise} A promise with borowed full {Object} history or fails with a {@link corbelError}.
         */
        getFullHistory: function(params) {
            console.log('borrowInterface.resource.getFullHistory');
            return this.request({
                url: this._buildUri(this.uri, 'history/'),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null
            });
        },

        _buildUri: corbel.Borrow._buildUri
    });
})();
