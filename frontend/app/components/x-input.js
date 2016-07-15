import Ember from "ember";

import Connector from 'stromx-web/components/connector';
import InputObserver from 'stromx-web/models/input-observer';

export default Connector.extend({
  isPushParameter: Ember.computed('view', {
    set: function (key, value) {
      if (value) {
        this.set('model.behavior', 'push');
      } else {
        this.set('model.behavior', 'persistent');
      }
      return value;
    },
    get: function() {
      return this.get('model.behavior') === 'push';
    }
  }),
  findObserver: function(view) {
    if (! view) {
      return Ember.RSVP.resolve(null);
    }

    var inputObservers = view.get('observers').filter(function(observer) {
      return observer instanceof InputObserver;
    });

    var input = this.get('model');
    return Ember.RSVP.all(inputObservers.map( function(observer) {
        return observer.get('input');
      })
    ).then( function(inputs) {
      var index = inputs.indexOf(input);
      return index !== -1 ? inputObservers[index] : null;
    });
  }
});
