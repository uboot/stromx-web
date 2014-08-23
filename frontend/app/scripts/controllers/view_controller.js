/* global App */

App.ViewController = Ember.ObjectController.extend({
  socket: null,

  init: function() {
    this._super();
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

  willDestroy: function() {
    var ws = this.get('socket');
    ws.close();
  },

  parameterObservers: Ember.computed.alias('observers'),

  connectorObservers: Ember.computed.filter('observers', function(observer) {
    return observer instanceof App.ConnectorObserver;
  }),

  observerSorting: ['zvalue:desc'],

  sortedObservers: Ember.computed.sort('observers', 'observerSorting'),
});
