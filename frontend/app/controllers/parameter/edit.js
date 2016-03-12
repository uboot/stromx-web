import Ember from "ember";

export default Ember.Controller.extend({
  currentValue: null,
  modelChanged: Ember.observer('model', 'model.value', function() {
    var value = this.get('model.value');
    if (! value) {
      var defaultValue = {
        rows: 1,
        cols: 1,
        values: [[0]]
      };
      this.set('model.value', defaultValue);
    }
  }),
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
