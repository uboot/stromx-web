/* global App */

App.ViewItemController = Ember.ObjectController.extend({
  isEditingName: false,

  actions: {
    saveName: function() {
      var model = this.get('model');
      model.save();
      this.set('isEditingName', false);
    },

    rename: function() {
      this.set('isEditingName', true);
    },

    remove: function () {
        var view = this.get('model');
        view.deleteRecord();
        view.save();
    }
  }
});
