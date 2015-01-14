import Ember from "ember";

export default Ember.ObjectController.extend({
  isEditingName: false,
  sorting: ['zvalue:desc'],
  sortedObservers: Ember.computed.sort('observers', 'sorting'),

  actions: {
    saveChanges: function() {
      this.set('isEditingName', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditingName', false);
      this.get('model').rollback();
    },
    editName: function() {
      this.set('isEditingName', true);
    },
  }
});
