import Ember from "ember";

import Connector from 'stromx-web/components/connector';
import OutputObserver from 'stromx-web/models/output-observer';

export default Connector.extend({
  isPullParameter: Ember.computed('view', {
    set: function (key, value) {
      if (value) {
        this.set('model.behavior', 'pull');
      } else {
        this.set('model.behavior', 'persistent');
      }
      return value;
    },
    get: function() {
      return this.get('model.behavior') === 'pull';
    }
  }),
  findObserver: function(view) {
    if (! view) {
      return Ember.RSVP.resolve(null);
    }

    var outputObservers = view.get('observers').filter(function(observer) {
      return observer instanceof OutputObserver;
    });

    var output = this.get('model');
    return Ember.RSVP.all(outputObservers.map( function(observer) {
        return observer.get('output');
      })
    ).then( function(outputs) {
      var index = outputs.indexOf(output);
      return index !== -1 ? outputObservers[index] : null;
    });
  }
});
