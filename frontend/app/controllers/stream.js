import Ember from "ember";

export default Ember.Controller.extend({
  queryParams: ['view'],
  view: null,

  isVisible: Ember.computed.equal('viewModel', null),
  
  viewModel: function() {
    var view = this.get('view');
    if (view === null) {
      return null;
    } else {
      return this.get('store').find('view', view);
    }
  }.property('view'),

  removeConnection: function(connection) {
    connection.deleteRecord();
    connection.save();
  },

  actions: {
    save: function() {
      this.get('model.file').then(function(file) {
        file.set('saved', true);
        file.save();
      });
    },
    start: function() {
        var stream = this.get('model');
        stream.set('active', true);
        stream.save().catch(function() {
          stream.rollback();
        }).then(function(stream) {
          stream.get('connections').forEach(function (connection) {
            connection.reload();
          });
        });
    },
    stop: function() {
        var stream = this.get('model');
        stream.set('active', false);
        stream.save();
    },
    pause: function() {
        var stream = this.get('model');
        stream.set('paused', true);
        stream.save();
    },
    resume: function() {
        var stream = this.get('model');
        stream.set('paused', false);
        stream.save();
    }
  }
});
