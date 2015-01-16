import Ember from "ember";
import ENV from '../config/environment';

export default Ember.Route.extend({
  socket: null,
  view: null,
  connectSocket: function() {
    var ws = this.get('socket');
    if (ws) {
      return;
    }

    var protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    var host = protocol + '//' + window.location.host;
    if (ENV.APP.SOCKET_HOST) {
      host = ENV.APP.SOCKET_HOST;
    }
    var url = host + '/socket/connectorValue';

    ws = new WebSocket(url);
    var _this = this;
    ws.onmessage = function(event) {
      var payload = JSON.parse(event.data);
      _this.store.pushPayload('connector-value', payload);
    };
    this.set('socket', ws);
  },
  disconnectSocket: function() {
    var ws = this.get('socket');
    if (! ws) {
      return;
    }

    ws.close();
    this.set('socket', null);
  },
  deactivate: function() {
    this.disconnectSocket();
  },
  updateDetails: function() {
    var view = this.get('view');
    if (view) {
      this.connectSocket();
      this.render('view-details', {
        into: 'stream',
        outlet: 'display',
        controller: 'view',
        model: view
      });
    } else {
      this.disconnectSocket();
      this.render('stream-details', {
        into: 'stream',
        outlet: 'display'
      });
    }
  },
  renderTemplate: function(controller, model) {
    this._super(controller, model);
    this.render('stream-details', {
      into: 'stream',
      outlet: 'display'
    });
  },
  actions: {
    renderDetails: function(view) {
      if (view) {
        this.connectSocket();
        this.render('view-details', {
          into: 'stream',
          outlet: 'display',
          controller: 'view',
          model: view
        });
      } else {
        this.disconnectSocket();
        this.render('stream-details', {
          into: 'stream',
          outlet: 'display'
        });
      }
    },
    closeView: function() {
      this.send('displayStream');
    }
  }
});
