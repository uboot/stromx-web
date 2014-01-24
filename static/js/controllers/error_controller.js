App.ErrorController = Ember.ObjectController.extend({
  init: function() {
    var url = 'ws://' + window.location.host + 'errors'
    var ws = new WebSocket(url);
    var controller = this
    ws.onmessage = function(event) {
      payload = JSON.parse(event.data)
      this.store.pushPayload('error', payload)
    }
  },
  time: function(key, value) {
    var model = this.get('model')
    time = model.get('time')
    return time.toLocaleTimeString()
  }.property('model.time')
});