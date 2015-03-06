import Ember from "ember";
export default Ember.Controller.extend({
  isEditingName: false,
  isEditingColor: false,

  actions: {
    saveChanges: function() {
      this.set('isEditingName', false);
      this.set('isEditingColor', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditingName', false);
      this.set('isEditingColor', false);
      this.get('model').rollback();
    },
    editName: function() {
      this.set('isEditingName', true);
    },
    editColor: function() {
      this.set('isEditingColor', true);
    },
    setColor: function(color) {
      this.set('model.color', color);
    }
  }
});
