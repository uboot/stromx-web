import Ember from "ember";

export default Ember.ObjectController.extend({
  isEditingName: false,

  isDeinitialized: Ember.computed.equal('status', 'none'),

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

  removeConnections: function() {
    var removeIncoming = this.get('model.inputs').then(function(inputs) {
      var connections = inputs.map( function(input) {
        return input.get('connection');
      });
      return Ember.RSVP.all(connections);
    }).then(function(connections) {
      connections.map( function(connection) {
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
      connectionLists.map( function(connections) {
        // convert to an array below because the 'connections' becomes invalid
        // if elements are removed from it
        connections.toArray().map( function(connection) {
          if (connection) {
            connection.deleteRecord();
            connection.save();
          }
        });
      });
    });

    return Ember.RSVP.all([removeIncoming, removeOutgoing]);
  },

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
    },
    initialize: function() {
      this.set('status', 'initialized');
      this.get('model').save();
    },
    deinitialize: function() {
      var _this = this;
      this.removeConnections().then(function() {
        _this.set('status', 'none');
        _this.get('model').save();
      });
    }
  }
});
