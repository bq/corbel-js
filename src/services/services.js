//@exclude

'use strict';

/* global corbel, BaseServices */

//deps: [corbel.ServicesBase]

//@endexclude

(function(BaseServices) {

    /**
     * A module to make iam requests.
     * @exports Services
     * @namespace
     * @memberof corbel
     */
    corbel.Services = BaseServices.inherit({}, { //Static props
        _FORCE_UPDATE_TEXT: 'unsupported_version',
        _FORCE_UPDATE_MAX_RETRIES: 3,
        _FORCE_UPDATE_STATUS: 'fu_r',
        create: function(driver) {
            return new corbel.Services(driver);
        },
        /**
         * Extract a id from the location header of a requestXHR
         * @param  {Promise} res response from a requestXHR
         * @return {String}  id from the Location
         */
        getLocationId: function(responseObject) {
            var location;

            if (responseObject.xhr) {
                location = arguments[0].xhr.getResponseHeader('location');
            } else if (responseObject.response.headers.location) {
                location = responseObject.response.headers.location;
            }
            return location ? location.substr(location.lastIndexOf('/') + 1) : undefined;
        },
        addEmptyJson: function(response, type) {
            if (!response && type === 'json') {
                response = '{}';
            }
            return response;
        },
        BaseServices: BaseServices
    });


    return corbel.Services;

})(BaseServices);