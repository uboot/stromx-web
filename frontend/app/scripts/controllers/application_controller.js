/* global App */

App.ApplicationController = Ember.ArrayController.extend({
  socket: null,

  init: function() {
    this._super();
    var url = 'ws://' + window.location.host + '/error_socket';
    var ws = new WebSocket(url);
    var store = this.store;
    var controller = this;
    ws.onmessage = function(event) {
      var payload = JSON.parse(event.data);
      store.pushPayload('error', payload);
      Ember.run.next(function() {
        store.find('error', payload.error.id).then(function(error) {
          controller.pushObject(error);
        });
      });
    };
    this.set('socket', ws);
  },

  willDestroy: function() {
    var ws = this.get('socket');
    ws.close();
  },

  sortProperties: ['time'],
  sortAscending: false,

  actions: {
    clearErrors: function() {
      this.get('model').clear();
    }
  }
});
