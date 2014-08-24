/* global App */

App.ViewRoute = Ember.Route.extend({
  socket: null,

  activate: function() {
    var url = 'ws://' + window.location.host + '/connectorValue_socket';
    var ws = new WebSocket(url);
    var store = this.store;
    var controller = this;
    ws.onmessage = function(event) {
      var payload = JSON.parse(event.data);
      store.pushPayload('connector-value', payload);
    };
    this.set('socket', ws);
  },

  deactivate: function() {
    var ws = this.get('socket');
    ws.close();
  },
});
