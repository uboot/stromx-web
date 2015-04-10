import Ember from "ember";

import ConnectorController from 'stromx-web/controllers/connector';
import ViewController from 'stromx-web/controllers/view-details';

export default ConnectorController.extend({
  findObserver: function(view) {
    if (! view) {
      return Ember.RSVP.resolve(null);
    }

    var viewController = ViewController.create({
      model: view
    });

    var output = this.get('model');
    var outputObservers = viewController.get('outputObservers');
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

      var viewController = ViewController.create({
        model: view,
        store: this.get('store')
      });

      var _this = this;
      var model = this.get('model');
      viewController.addOutputObserver(model).then( function(observer) {
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
