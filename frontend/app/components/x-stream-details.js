import Ember from "ember";

export default Ember.Component.extend({
  zoom: 1.0,
  width: function() {
    return 1280 * this.get('zoom');
  }.property('zoom'),
  height: function() {
    return 1024 * this.get('zoom');
  }.property('zoom'),
  patternUri: function() {
    return 'url(' + this.get('targetObject.target.url') + '#grid)';
  }.property('targetObject.target.url'),
  activeOutput: null,
  activeInput: null,

  addConnection: function(input, output) {
    var model = this.get('model');
    var store = this.get('targetObject').store;
    var connection = store.createRecord('connection', {
      output: output,
      input: input,
      stream: model
    });

    var targetObject = this.get('targetObject');
    connection.save().then(function(connection) {
      targetObject.transitionToRoute('connection', connection);
    });
  },

  actions: {
    magnify: function() {
      var newZoom = Math.min(8.0, this.get('zoom') * Math.sqrt(2.0));
      this.set('zoom', newZoom);
    },
    minify: function() {
      var newZoom = Math.max(0.125, this.get('zoom') / Math.sqrt(2.0));
      this.set('zoom', newZoom);
    },
    reset: function() {
      this.set('zoom', 1.0);
    }
  }
});
