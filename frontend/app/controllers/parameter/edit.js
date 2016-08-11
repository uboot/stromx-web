import Ember from "ember";

export default Ember.Controller.extend({
  value: Ember.computed('model.value', {
    get: function() {
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
        return defaultValue;
      }

      return Ember.$.extend(true, {}, value);
    },
    set: function(key, value) {
      this.set('model.value', Ember.$.extend(true, {}, value));
      return value;
    }
  }),
  actions: {
    dismiss: function() {
      this.transitionToRoute('operator.index', this.get('model.operator'));
    },
    cancel: function() {
      this.set('value', null);
      this.get('model').rollbackAttributes();
    },
    save: function(value) {
      this.set('value', value);
      this.get('model').save();
    }
  }
});
