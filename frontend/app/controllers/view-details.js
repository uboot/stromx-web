import Ember from "ember";
import View from 'stromx-web/controllers/view';
import { DEFAULT_OBSERVER_COLOR } from 'stromx-web/colors';

export default View.extend({
  svgSorting: ['zvalue:incr'],
  svgSortedObservers: Ember.computed.sort('model.observers', 'svgSorting'),

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
  }
});
