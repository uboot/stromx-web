import Ember from "ember";
import ConnectorController from 'stromx-web/controllers/connector';
import InputObserver from 'stromx-web/models/input-observer';
import ViewController from 'stromx-web/controllers/view-details';

export default ConnectorController.extend({
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
  },

  actions: {
    addObserver: function() {
      var view = this.get('view');
      if (! view) {
        return;
      }

      var viewController = ViewController.create({
        model: view,
        store: this.get('store')
      });

      var _this = this;
      var model = this.get('model');
      viewController.addInputObserver(model).then( function(observer) {
        _this.transitionToRoute('inputObserver.index', observer);
      });
    },
    showObserver: function() {
      var view = this.get('view');
      if (! view) {
        return;
      }

      var _this = this;
      this.findObserver(view).then( function(observer) {
        _this.transitionToRoute('inputObserver.index', observer);
      });
    }
  }
});
