import Ember from "ember";
import InputObserver from 'stromx-web/models/input-observer';
import OutputObserver from 'stromx-web/models/output-observer';
import ParameterObserver from 'stromx-web/models/parameter-observer';
import { DEFAULT_OBSERVER_COLOR } from 'stromx-web/colors';
import ENV from '../config/environment';
import ACK from 'stromx-web/socket';

export default Ember.Controller.extend({
  zoom: 1.0,
  width: function() {
    return 1280 * this.get('zoom');
  }.property('zoom'),
  height: function() {
    return 1024 * this.get('zoom');
  }.property('zoom'),

  parameterObservers:  Ember.computed.filter('model.observers', function(observer) {
    return observer instanceof ParameterObserver;
  }),
  inputObservers: Ember.computed.filter('model.observers', function(observer) {
    return observer instanceof InputObserver;
  }),
  outputObservers: Ember.computed.filter('model.observers', function(observer) {
    return observer instanceof OutputObserver;
  }),

  svgSorting: ['zvalue:incr'],
  htmlSorting: ['zvalue:decr'],
  svgObservers: Ember.computed.sort('model.observers', 'svgSorting'),
  htmlObservers: Ember.computed.sort('model.observers', 'htmlSorting'),


  socket: null,

  init: function() {
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

  willDestroy: function() {
    var ws = this.get('socket');
    if (! ws) {
      return;
    }

    ws.close();
    this.set('socket', null);
  },

  addInputObserver: function(input) {
    var numObservers = this.get('model.observers.length');
    var observer = this.store.createRecord('input-observer', {
      view: this.get('model'),
      input: input,
      zvalue: numObservers + 1,
      properties: {
        color: DEFAULT_OBSERVER_COLOR
      },
      visualization: 'default'
    });

    // add the observer to the view
    // FIXME: is this really necessary or should ember-data automatically
    // add the data?
    var observers = this.get('model.observers');
    observers.addObject(observer);

    // save the observer
    return observer.save();
  },

  addOutputObserver: function(output) {
    var numObservers = this.get('model.observers.length');
    var observer = this.store.createRecord('output-observer', {
      view: this.get('model'),
      output: output,
      zvalue: numObservers + 1,
      properties: {
        color: DEFAULT_OBSERVER_COLOR
      },
      visualization: 'default'
    });

    // add the observer to the view
    // FIXME: is this really necessary or should ember-data automatically
    // add the data?
    var observers = this.get('model.observers');
    observers.addObject(observer);

    // save the observer
    return observer.save();
  },

  removeObserver: function(observer) {
    var zvalue = observer.get('zvalue');
    var view = this.get('model');

    var observers = view.get('observers');
    observers.removeObject(observer);

    return observers.then(function(observers) {
      observers.forEach(function(iter) {
        var thisZValue = iter.get('zvalue');
        if (thisZValue > zvalue) {
          iter.set('zvalue', thisZValue - 1);
          iter.save();
        }
      });
      observer.deleteRecord();
      return observer.save();
    });
  },

  actions: {
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
    }
  }
});
