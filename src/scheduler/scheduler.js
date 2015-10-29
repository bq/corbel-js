(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    corbel.Scheduler = corbel.Object.inherit({

        /**
         * Create a new SchedulerBuilder
         * @param  {String} type String
         * @return {Scheduler}
         */
        constructor: function(driver) {
            this.driver = driver;
        },

        task: function(id) {
            return new corbel.Scheduler.TaskBuilder(this.driver, id);
        }
    }, {

        moduleName: 'scheduler',
        defaultPort: 8098,

        create: function(driver) {
            return new corbel.Scheduler(driver);
        }
    });

    return corbel.Scheduler;
})();
