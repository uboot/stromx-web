import Ember from "ember";
import ParameterObserverModel from 'stromx-web/models/parameter-observer';
import InputObserverModel from 'stromx-web/models/input-observer';
import OutputObserverModel from 'stromx-web/models/output-observer';

export default Ember.Controller.extend({
  needs: ['stream'],
  
  isParameterObserver: function() {
    return this.get('model') instanceof ParameterObserverModel;
  }.property('model'),

  isInputObserver: function() {
    return this.get('model') instanceof InputObserverModel;
  }.property('model'),

  isOutputObserver: function() {
    return this.get('model') instanceof OutputObserverModel;
  }.property('model'),

  actions: {
    moveUp: function() {
      var model = this.get('model');
      var zvalue = model.get('zvalue');
      model.get('view').then(function(view) {
        var observers = view.get('observers');
        var modelAbove = observers.findBy('zvalue', zvalue + 1);
        if (modelAbove) {
          model.set('zvalue', zvalue + 1);
          modelAbove.set('zvalue', zvalue);
          model.save();
          modelAbove.save();
        }
      });
    },
    moveDown: function() {
      var model = this.get('model');
      var zvalue = model.get('zvalue');
      model.get('view').then(function(view) {
        var observers = view.get('observers');
        var modelBelow = observers.findBy('zvalue', zvalue - 1);
        if (modelBelow) {
          modelBelow.set('zvalue', zvalue);
          model.set('zvalue', zvalue - 1);
          modelBelow.save();
          model.save();
        }
      });
    }
  }
});
