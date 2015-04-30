import Ember from "ember";
import ConnectorController from 'stromx-web/controllers/connector';
import OutputObserver from 'stromx-web/models/output-observer';
import { DEFAULT_OBSERVER_COLOR } from 'stromx-web/colors';

export default ConnectorController.extend({
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
  },

  actions: {
    addObserver: function() {
      var view = this.get('view');
      if (! view) {
        return;
      }
      
      var numObservers = this.get('model.observers.length');
      var observer = this.store.createRecord('output-observer', {
        view: view,
        output: this.get('model'),
        zvalue: numObservers + 1,
        properties: {
          color: DEFAULT_OBSERVER_COLOR
        },
        visualization: 'default'
      });

      var _this = this;
      observer.save().then(function(observer) {
        _this.reloadView();
        _this.transitionToRoute('outputObserver.index', observer);
      });
    },
    showObserver: function() {
      var view = this.get('view');
      if (! view) {
        return;
      }

      var _this = this;
      this.findObserver(view).then( function(observer) {
        _this.transitionToRoute('outputObserver.index', observer);
      });
    }
  }
});
