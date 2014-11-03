/* global App */

App.StreamNewOperatorController = Ember.Controller.extend({
  actions: {
    saveOperator: function () {
      var stream = this.get('model');
      var name = this.get('viewName');
      var op = this.store.createRecord('operator', {
        package: '',
        type: '',
        stream: stream,
        position: {
          x: 0,
          y: 0
        }
      });
      op.save();

      this.transitionToRoute('stream');
    }
  }
});
