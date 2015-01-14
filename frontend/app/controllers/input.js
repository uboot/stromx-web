import Ember from "ember";

import InputObserverModel from 'stromx-web/models/input-observer';

export default Ember.ObjectController.extend({
  isEditingObserver: false,

  view: null,
  views: Ember.computed.alias('operator.stream.views'),

  actions: {
    editObserver: function() {
      this.set('isEditingObserver', true);
    },
    discardChanges: function() {
      this.set('isEditingObserver', false);
    },
    addObserver: function() {
      var view = this.get('view');
      if (! view) {
        return;
      }

      var _this = this;
      var model = this.get('model');
      view.get('observers').then(function(observers) {
        var observer = observers.find(function(observer) {
          if (! observer instanceof InputObserverModel) {
            return false;
          }

          return observer.get('input').then(function(input) {
            return input === model;
          });
        });

        if (! observer) {
          observer = _this.store.createRecord('input-observer', {
            view: view,
            input: model
          });
        }
        _this.transitionToRoute('inputObserver.index', observer);
      });
    }
  }
});
