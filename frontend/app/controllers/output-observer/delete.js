import Ember from "ember";

import ViewController from 'stromx-web/controllers/view-details';

export default Ember.Controller.extend({
  wasRemoved: false,
  view: null,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('view.index', this.get('view'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('outputObserver.index', this.get('model'));
      }
    },
    remove: function () {
      var observer = this.get('model');
      var store = this.get('store');
      var view = observer.get('view');
      
      var viewController = ViewController.create({
        model: view,
        store: store
      });
      viewController.removeObserver(observer);
      
      // remember the view
      this.set('view', view);
      this.set('wasRemoved', true);
    }
  }
});
