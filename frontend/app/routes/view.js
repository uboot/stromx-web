import Ember from "ember";

export default Ember.Route.extend({
  socket: null,

  activate: function() {
    var url = 'ws://' + 'localhost:8888' + '/connectorValue_socket';
    // var url = 'ws://' + window.location.host + '/connectorValue_socket';
    var ws = new WebSocket(url);
    var _this = this;
    ws.onmessage = function(event) {
      var payload = JSON.parse(event.data);
      _this.store.pushPayload('connector-value', payload);
    };
    this.set('socket', ws);
  },

  deactivate: function() {
    var ws = this.get('socket');
    ws.close();
  },
});
