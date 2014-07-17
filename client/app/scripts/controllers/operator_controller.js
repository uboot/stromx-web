/* global App */

App.OperatorController = Ember.ObjectController.extend({
  fullType: function() {
    return this.get('package') + '::' + this.get('type');
  }.property('type', 'package'),

  statusLabel: function() {
    var status = this.get('model').get('status');

    if (status === 'none')
      return 'Not initialized';
    else if (status === 'initialized')
      return 'Initialized';
    else if (status === 'active')
      return 'Active';
    else
      return 'Not defined';
  }.property('status'),

  isEditingName: false,

  actions: {
    editName: function() {
      this.set('isEditingName', true);
    },
    saveName: function() {
      this.set('isEditingName', false);
      var model = this.get('model');
      model.save();
    },
    save: function() {
      var model = this.get('model');
      var inputs = model.get('inputs');
      var outputs = model.get('outputs');
      Ember.RSVP.all([inputs, outputs]).then( function(values){
        model.set('inputs', values[0]);
        model.set('outputs', values[1]);
        model.save();
      })
    }
  }
});
