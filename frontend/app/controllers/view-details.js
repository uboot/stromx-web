import Ember from "ember";
import InputObserver from 'stromx-web/models/input-observer';
import OutputObserver from 'stromx-web/models/output-observer';
import ParameterObserver from 'stromx-web/models/parameter-observer';
import { defaultObserverColor } from 'stromx-web/colors';

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

  addInputObserver: function(input) {
    var numObservers = this.get('model.observers.length');
    var observer = this.store.createRecord('input-observer', {
      view: this.get('model'),
      input: input,
      zvalue: numObservers + 1,
      properties: {
        color: defaultObserverColor
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
        color: defaultObserverColor
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
