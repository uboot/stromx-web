/* global App */

App.ApplicationRoute = Ember.Route.extend({
  actions: {
    showModal: function(modal, model) {
      var controller = this.controllerFor(modal);
      controller.set('model', model);
      return this.render(modal, {
        into: 'application',
        outlet: 'modal',
        controller: controller
      });
    },
    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});