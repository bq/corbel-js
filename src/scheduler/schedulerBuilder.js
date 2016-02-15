// @exclude
'use strict'
// @endexclude
/*globals corbel */

;(function () {
  var TaskBuilder = corbel.Scheduler.TaskBuilder = corbel.Services.inherit({
    constructor: function (driver, id) {
      this.uri = 'tasks'
      this.driver = driver
      this.id = id
    },

    create: function (task) {
      console.log('schedulerInterface.task.create', task)
      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.POST,
        data: task
      }).then(function (res) {
        return corbel.Services.getLocationId(res)
      })
    },

    get: function (params) {
      console.log('schedulerInterface.task.get', params)
      corbel.validate.value('id', this.id)
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      })
    },

    update: function (task) {
      console.log('schedulerInterface.task.update', task)
      corbel.validate.value('id', this.id)
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.PUT,
        data: task
      })
    },

    delete: function () {
      console.log('schedulerInterface.task.delete')
      corbel.validate.value('id', this.id)
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.DELETE
      })
    },

    _buildUri: function (path, id) {
      var uri = ''
      var urlBase = this.driver.config.getCurrentEndpoint(corbel.Scheduler.moduleName, this._buildPort(this.driver.config))

      uri = urlBase + path
      if (id) {
        uri += '/' + id
      }
      return uri
    },

    _buildPort: function (config) {
      return config.get('schedulerPort', null) || corbel.Notifications.defaultPort
    }

  }, {
    moduleName: 'tasks',

    create: function (driver) {
      return new corbel.TaskBuilder(driver)
    }

  })

  return TaskBuilder
})()
