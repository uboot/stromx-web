/* global App */

App.Constants = {
  OPERATOR_SIZE: 50,
  CONNECTOR_SIZE: 10
};

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

  transform: function() {
    var pos = this.get('position');
    if (pos === undefined)
      return '';
      
    return 'translate(' + pos.x + ' ' + pos.y + ')';
  }.property('position'),
  
  dragStartPosition: {x: 0, y: 0},

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
      model.save();
    },
    showOperatorMenu: function(x, y) {
      this.send('showContextMenu', 'operatorMenu', x, y, this);
    },
    dragStart: function() {
      var pos = this.get('position');
      this.dragStartPosition = {
        x: pos.x,
        y: pos.y
      };
    },
    dragMove: function(dx, dy) {
      this.set('position', {
        x: this.dragStartPosition.x + dx,
        y: this.dragStartPosition.y + dy
    });
    },
    initialize: function(e) {
      console.log(e);
      console.log('initialize ' + this.get('name'));
    },
    deinitialize: function() {
      console.log('deinitialize ' + this.get('name'));
    }
  }
});
