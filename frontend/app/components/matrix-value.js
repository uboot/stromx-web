import Ember from "ember";

export default Ember.Component.extend({
  row: 0,
  col: 0,
  value: null,
  
  actions: {
    accept: function() {
      this.sendAction('storeValue', this.get('row'), this.get('col'), 
                      this.get('value'));
    }
  }
});
