//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {
	
	function CorbelDriver(config) {
		this.config = corbel.Config.create(config);
	}

	corbel.CorbelDriver = CorbelDriver;

	corbel.getDriver = function(config) {
		config = config || {};
		
		if (!config.urlBase) {
			throw new Error('undefined:urlBase');
		}
		
		if (!config.clientId) {
			throw new Error('undefined:clientId');
		}
		
		if (!config.clientSecret) {
			throw new Error('undefined:clientSecret');
		}
		
		if (!config.scopesApp) {
			throw new Error('undefined:scopesApp');
		}
		
		if (!config.scopesUserLogin) {
			throw new Error('undefined:scopesUserLogin');
		}
		
		if (!config.scopesUserCreate) {
			throw new Error('undefined:scopesUserCreate');
		}

		return new CorbelDriver(config);
	};


})();