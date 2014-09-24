/* global App */

App.ApplicationRoute = Ember.Route.extend({
  socket: null,

  activate: function() {
    var url = 'ws://' + 'localhost:8888' + '/error_socket';
    // var url = 'ws://' + window.location.host + '/error_socket';
    var ws = new WebSocket(url);
    var _this = this;
    ws.onmessage = function(event) {
      var payload = JSON.parse(event.data);
      _this.store.pushPayload('error', payload);
      Ember.run.next(function() {
        _this.store.find('error', payload.error.id).then(function(error) {
          _this.controller.pushObject(error);
        });
      });
    };
    this.set('socket', ws);
  },

  deactivate: function() {
    var ws = this.get('socket');
    ws.close();
  },

  actions: {
    showModal: function(modal, model) {
      var controller = this.controllerFor(modal);
      controller.set('model', model);
      return this.render(modal, {
        into: 'application',
        outlet: 'modal',
        controller: controller
      });
    },
    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
