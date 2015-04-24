import Ember from "ember";
import ViewDetails from 'stromx-web/controllers/view-details';
import ENV from '../config/environment';
import ACK from 'stromx-web/socket';

export default Ember.Controller.extend({
  needs: ['application'],
  queryParams: ['view'],
  activeOutput: null,
  activeInput: null,
  view: null,
  socket: null,
  zoom: 1.0,
  width: function() {
    return 1280 * this.get('zoom');
  }.property('zoom'),
  height: function() {
    return 1024 * this.get('zoom');
  }.property('zoom'),

  viewController: function() {
    var viewModel = null;
    var view = this.get('view');
    if (view === null) {
      return null;
    } else {
      viewModel = this.get('store').find('view', view);
    }
    
    if (! viewModel) {
      return null;
    } else {
      return ViewDetails.create({
        model: viewModel
      });
    }
  }.property('view'),

  isVisible: Ember.computed.equal('viewController', null),

  addConnection: function(input, output) {
    var store = this.get('store');
    var model = this.get('model');
    var connection = store.createRecord('connection', {
      output: output,
      input: input,
      stream: model
    });

    var _this = this;
    connection.save().then(function(connection) {
      _this.transitionToRoute('connection', connection);
    });
  },

  removeConnection: function(connection) {
    connection.deleteRecord();
    connection.save();
  },
  
  patternUri: function() {
    return 'url(' + this.get('target.url') + '#grid)';
  }.property('target.url'),

  actions: {
    save: function() {
      this.get('model.file').then(function(file) {
        file.set('saved', true);
        file.save();
      });
    },
    start: function() {
        var stream = this.get('model');
        stream.set('active', true);
        stream.save().catch(function() {
          stream.rollback();
        }).then(function(stream) {
          stream.get('connections').forEach(function (connection) {
            connection.reload();
          });
        });
    },
    stop: function() {
        var stream = this.get('model');
        stream.set('active', false);
        stream.save();
    },
    pause: function() {
        var stream = this.get('model');
        stream.set('paused', true);
        stream.save();
    },
    resume: function() {
        var stream = this.get('model');
        stream.set('paused', false);
        stream.save();
    },
    magnify: function() {
      var newZoom = Math.min(8.0, this.get('zoom') * Math.sqrt(2.0));
      this.set('zoom', newZoom);
    },
    minify: function() {
      var newZoom = Math.max(0.125, this.get('zoom') / Math.sqrt(2.0));
      this.set('zoom', newZoom);
    },
    reset: function() {
      this.set('zoom', 1.0);
    },
    connect: function() {
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
        ws.send(ACK);
        var payload = JSON.parse(event.data);
        _this.store.pushPayload('connector-value', payload);
      };
      this.set('socket', ws);
    },
    
    disconnect: function() {
      var ws = this.get('socket');
      if (! ws) {
        return;
      }

      ws.close();
      this.set('socket', null);
    }
  }
});
