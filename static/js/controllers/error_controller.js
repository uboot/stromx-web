App.ErrorController = Ember.ObjectController.extend({  
  time: function(key, value) {
    var model = this.get('model')
    time = model.get('time')
    return time.toLocaleTimeString()
  }.property('model.time')
});

App.ApplicationController = Ember.ArrayController.extend({
  init: function() {
    var url = 'ws://' + window.location.host + '/error_socket'
    var ws = new WebSocket(url);
    var store = this.store
    var controller = this
    ws.onmessage = function(event) {
      var payload = JSON.parse(event.data)
      store.pushPayload('error', payload)
      Ember.run.next(function() {
        store.find('error', payload.error[0].id).then(function(error) {
          controller.pushObject(error)
        })
      })
    }
  },
});