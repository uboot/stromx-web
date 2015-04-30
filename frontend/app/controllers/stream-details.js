import Stream from 'stromx-web/controllers/stream';

export default Stream.extend({
  zoom: 1.0,
  width: function() {
    return 1280 * this.get('zoom');
  }.property('zoom'),
  height: function() {
    return 1024 * this.get('zoom');
  }.property('zoom'),
  patternUri: function() {
    return 'url(' + this.get('parentController.target.url') + '#grid)';
  }.property('parentController.target.url'),
  activeOutput: null,
  activeInput: null,

  addConnection: function(input, output) {
    var store = this.get('store');
    var model = this.get('model');
    var connection = store.createRecord('connection', {
      output: output,
      input: input,
      stream: model
    });

    var _this = this;
    connection.save().then(function(connection) {
      _this.transitionToRoute('connection', connection);
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
