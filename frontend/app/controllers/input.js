import Ember from "ember";

export default Ember.ObjectController.extend({
  isEditingObserver: false,
  
  view: null,
  views: Ember.computed.alias('operator.stream.views'),

  actions: {
    editObserver: function() {
      this.set('isEditingObserver', true);
    },
    discardChanges: function() {
      this.set('isEditingObserver', false);
    },
    addObserver: function() {
      var view = this.get('view');
      if (! view) {
        return;
      }
    }
  }
});
