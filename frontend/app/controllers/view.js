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
      this.get('model').rollbackAttributes();
    },
    editName: function() {
      this.set('isEditingName', true);
    },
    updateSorting: function() {
      var model = this.get('model');
      var promises = model.get('observers').map(function(observer) {
        return observer.reload();
      });
      Ember.RSVP.all(promises).then(function() {
        model.reload();
      });
    }
  }
});
