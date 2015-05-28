import Ember from "ember";

export default Ember.Controller.extend({
  isEditingName: false,
  sorting: ['zvalue:desc'],
  sortedObservers: Ember.computed.sort('model.observers', 'sorting'),
  hasObservers: Ember.computed.gt('model.observers.length', 0),

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
