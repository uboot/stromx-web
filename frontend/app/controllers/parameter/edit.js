import Ember from "ember";

export default Ember.Controller.extend({
  currentValue: null,
  modelChanged: Ember.observer('model', 'model.value', function() {
    var value = this.get('model.value');
    if (! value) {
      var rows = this.get('model.rows') > 0 ? this.get('model.rows') : 1;
      var cols = this.get('model.cols') > 0 ? this.get('model.cols') : 1;
      var values = [];
      for (var i = 0; i < rows; ++i) {
        values.push(new Array(cols).fill(0));
      }
      var defaultValue = {
        rows: rows,
        cols: cols,
        values: values
      };
      this.set('model.value', defaultValue);
    }
  }),
  actions: {
    dismiss: function () {
      this.get('model').rollbackAttributes();
      this.transitionToRoute('operator.index', this.get('model.operator'));
    },
    save: function () {
      this.get('model').save();
    }
  }
});
