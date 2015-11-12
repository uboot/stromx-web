import Ember from "ember";

export default Ember.Controller.extend({
  currentValue: null,
  actions: {
    storeCurrentValue: function(value) {
      this.set('currentValue', value);
    },
    dismiss: function () {
      this.transitionToRoute('operator.index', this.get('model.operator'));
    },
    save: function () {
      var parameter = this.get('model');
      parameter.set('value', this.get('currentValue'));
      parameter.save();
    }
  }
});
