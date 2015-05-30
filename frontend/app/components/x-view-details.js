import Ember from "ember";

import ENV from '../config/environment';
import ACK from 'stromx-web/socket';

export default Ember.Component.extend({
  socket: null,
  sorting: ['zvalue:desc'],
  sortedObservers: Ember.computed.sort('model.observers', 'sorting'),
  svgSorting: ['zvalue:incr'],
  svgSortedObservers: Ember.computed.sort('model.observers', 'svgSorting'),
  zoom: 1.0,
  width: function() {
    return 1280 * this.get('zoom');
  }.property('zoom'),
  height: function() {
    return 1024 * this.get('zoom');
  }.property('zoom'),

  didInsertElement: function() {
    this.send('connect');
  },
  willDestroyElement: function() {
    this.send('disconnect');
  },

  actions: {
    magnify: function() {
      var newZoom = Math.min(8.0, this.get('zoom') * Math.sqrt(2.0));
      this.set('zoom', newZoom);
    },
    reset: function() {
      this.set('zoom', 1.0);
    },
    minify: function() {
      var newZoom = Math.max(0.125, this.get('zoom') / Math.sqrt(2.0));
      this.set('zoom', newZoom);
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
        _this.sendAction('pushValue', payload);
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
