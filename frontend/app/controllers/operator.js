import Ember from "ember";

export default Ember.ObjectController.extend({
  isEditingName: false,
  
  fullType: function() {
    return this.get('package') + '::' + this.get('type');
  }.property('type', 'package'),

  statusLabel: function() {
    var status = this.get('model').get('status');

    switch (status) {
      case 'none':
        return 'Not initialized';
      case 'initialized':
        return 'Initialized';
      case 'active':
        return 'Active';
      default:
        return 'Not defined';
    }
  }.property('status'),

  actions: {
    editName: function() {
      this.set('isEditingName', true);
    },
    saveChanges: function() {
      this.set('isEditingName', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditingName', false);
      this.get('model').rollback();
    }
  }
});
