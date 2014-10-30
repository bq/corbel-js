(function() {
    var options = {



    };

    var config = {};

    config.set = function(key, value) {
        options[key] = value;
    };

    config.get = function(key) {
        return options[key];
    };


    //nodejs
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = config;
    }
    //Browser
    if (typeof window !== 'undefined') {

    }

})();