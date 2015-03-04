import Ember from "ember";

export default Ember.ObjectController.extend({
  actions: {
    dismiss: function () {
      this.transitionToRoute('operator.index', this.get('model.operator'));
    },
    save: function () {
      var parameter = this.get('model');
      parameter.save();
    }
  }
});
