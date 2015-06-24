//@exclude
'use strict';
//@endexclude

(function() {


    /**
     * A builder for borrowed management requests.
     *
     * @param {String}  id user ID.
     *
     * @class
     * @memberOf corbel.Borrow.UserBuilder
     */
    corbel.Borrow.UserBuilder = corbel.Services.inherit({

        constructor: function(id) {
            this.id = id || 'me';
            this.uri = 'user';
        },
        /**
         * Get all reservations of a user.
         *
         * @method
         * @memberOf corbel.Borrow.UserBuilder
         *
         * @return {Promise} A promise with all user reservations {Object} or fails with a {@link corbelError}.
         */
        getAllReservations: function() {
            console.log('borrowInterface.user.getAllReservations', this.id);
            return this.request({
                url: this._buildUri(this.uri ,this.id, 'reservation'),
                method: corbel.request.method.GET
            });
        },
        /**
         *  Get all loans of a user.
         *
         * @method
         * @memberOf corbel.Borrow.UserBuilder
         *
         * @return {Promise} A promise with all user loans {Object} or fails with a {@link corbelError}.
         */
        getAllLoans: function() {
            console.log('borrowInterface.user.getAllLoans', this.id);
            return this.request({
                url: this._buildUri(this.uri ,this.id, 'loan'),
                method: corbel.request.method.GET
            });
        },


        _buildUri: corbel.Borrow._buildUri
    });
})();
