/* global App */

App.ViewNewObserverController = Ember.Controller.extend({
  actions: {
    newObserver: function () {

      this.transitionToRoute('view');
    }
  }
});
