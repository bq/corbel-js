//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * A module to make Borrow requests.
   * @exports Borrow
   * @namespace
   * @memberof app.corbel
   */

  corbel.Borrow = corbel.Object.inherit({

    constructor: function(driver) {
      this.driver = driver;
    },



    /**
     * Create a BorrowBuilder for resource managing requests.
     *
     * @param {String}  id  The id of the borrow.
     *
     * @return {corbel.Borrow.BorrowBuilder}
     */
    resource : function(id) {
        var resource = new corbel.Borrow.BorrowBuilder(id);
        resource.driver = this.driver;
        return resource;
    },

    /**
     * Create a LenderBuilder for lender managing requests.
     *
     * @param {String}  id  The id of the lender.
     *
     * @return {corbel.Borrow.LenderBuilder}
     */
    lender: function(id) {
        var lender = new corbel.Borrow.LenderBuilder(id);
        lender.driver = this.driver;
        return lender;
    },

    /**
     * Create a UserBuilder for user managing requests.
     *
     * @param {String}  id  The id of the user.
     *
     * @return {corbel.Borrow.UserBuilder}
     */
     user: function(id) {
        var user = new corbel.Borrow.UserBuilder(id);
        user.driver = this.driver;
        return user;
     }




  }, {
    moduleName: 'borrow',
    defaultPort: 8100,

    create: function(driver) {
      return new corbel.Borrow(driver);
    },

    _buildUri: function() {
        var uri='';
        Array.prototype.slice.call(arguments).forEach(function(argument) {
          if (argument){
            uri+= '/' + argument;
          }
        });

        var urlBase = this.driver.config.get('borrowEndpoint', null) ||
          this.driver.config.get('urlBase')
            .replace(corbel.Config.URL_BASE_PLACEHOLDER, corbel.Borrow.moduleName)
            .replace(corbel.Config.URL_BASE_PORT_PLACEHOLDER, corbel.Borrow._buildPort(this.driver.config));

        if (urlBase.slice(-1) === '/') {
          urlBase = urlBase.substring(0, urlBase.length - 1);
        }

        return urlBase + uri;
    },

    _buildPort: function(config) {
      return config.get('borrowPort', null) || corbel.Borrow.defaultPort;
    }
  });

  return corbel.Borrow;





})();
