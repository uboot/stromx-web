import Ember from "ember";

export var Constants = {
  OPERATOR_SIZE: 50,
  CONNECTOR_SIZE: 10
};

export default Ember.ObjectController.extend({
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

  isEditingName: false,

  transform: function() {
    var pos = this.get('position');
    if (pos === undefined) {
      return '';
    }

    return 'translate(' + pos.x + ' ' + pos.y + ')';
  }.property('position'),

  dragStartPosition: {x: 0, y: 0},

  removeConnections: function() {
    var removeIncoming = this.get('model.inputs').then(function(inputs) {
      var connections = inputs.map(function(input) {
        return input.get('connection');
      });
      return Ember.RSVP.all(connections);
    }).then(function(connections) {
      connections.map(function(connection) {
        if (connection) {
          connection.deleteRecord();
          connection.save();
        }
      });
    });

    var removeOutgoing = this.get('model.outputs').then(function(outputs) {
      var connectionLists = outputs.map(function(output) {
        return output.get('connections');
      });
      return Ember.RSVP.all(connectionLists);
    }).then(function(connectionLists) {
      connectionLists.map(function(connections) {
        connections.map(function(connection){
          connection.deleteRecord();
          connection.save();
        });
      });
    });

    return Ember.RSVP.all([removeIncoming, removeOutgoing]);
  },

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
    showMenu: function(x, y) {
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
    dragEnd: function() {
      var pos = this.get('position');
      this.set('position', {
        x: 25 * Math.round(pos.x / 25),
        y: 25 * Math.round(pos.y / 25)
      });
      this.send('save');
    },
    initialize: function() {
      this.set('status', 'initialized');
      this.model.save();
    },
    deinitialize: function() {
      var _this = this;
      this.removeConnections().then(function() {
        _this.set('status', 'none');
        var model = _this.get('model');
        model.save();
      });
    },
    remove: function() {
      var _this = this;
      this.removeConnections().then(function() {
        var model = _this.get('model');
        model.deleteRecord();
        model.save();
      });
    }
  }
});
