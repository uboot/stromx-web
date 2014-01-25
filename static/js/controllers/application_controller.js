App.ApplicationController = Ember.ArrayController.extend({
  init: function() {
    this._super()
    var url = 'ws://' + window.location.host + '/error_socket'
    var ws = new WebSocket(url);
    var store = this.store
    var controller = this
    ws.onmessage = function(event) {
      var payload = JSON.parse(event.data)
      store.pushPayload('error', payload)
      Ember.run.next(function() {
        store.find('error', payload.error.id).then(function(error) {
          controller.pushObject(error)
        })
      })
    }
  },
  sortProperties: ['time'],
  sortAscending: false
});