import Ember from "ember";
import ParameterObserverModel from 'stromx-web/models/parameter-observer';
import InputObserverModel from 'stromx-web/models/input-observer';
import OutputObserverModel from 'stromx-web/models/output-observer';

export default Ember.Controller.extend({
  stream: Ember.inject.controller(),

  isParameterObserver: function() {
    return this.get('model') instanceof ParameterObserverModel;
  }.property('model'),

  isInputObserver: function() {
    return this.get('model') instanceof InputObserverModel;
  }.property('model'),

  isOutputObserver: function() {
    return this.get('model') instanceof OutputObserverModel;
  }.property('model'),

  updateZvalue: function(update) {
    var model = this.get('model');
    var zvalue = model.get('zvalue');
    var newZvalue = zvalue + update;
    var numObservers = view.get('observers.length');

    if (newZvalue < 0 || newZvalue >= numObservers) {
      return;
    }

    model.set('zvalue', newZvalue);
    model.save().then(function() {
      var view = model.get('view');
      view.then(function(view) {
        view.get('observers').forEach(function(observer) {
          observer.reload();
        });
      });
    });
  },

  actions: {
    moveUp: function() {
      this.updateZvalue(+1);
    },
    moveDown: function() {
      this.updateZvalue(-1);
    }
  }
});

