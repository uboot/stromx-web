import Ember from "ember";

export default Ember.ObjectController.extend({
  needs: ['application'],
  activeOutput: null,
  activeInput: null,
  
  patternUri: function() {
    return 'url(' + this.get('target.url') + '#grid)';
  }.property('target.url'),
  
  arrowsUri: function() {
    return this.get('target.url') + '#arrows';
  }.property('target.url'),
  
  actions: {
    close: function () {
      var stream = this.get('model');
      this.get('file').then(function(file) {
        stream.set('saved', true);
        stream.save().then(function() {
          file.set('opened', false);
          file.save();
        });
      });
      this.transitionToRoute('files');
    },
    start: function () {
        this.set('active', true);
        var stream = this.get('model');
        stream.save();
    },
    stop: function () {
        this.set('active', false);
        var stream = this.get('model');
        stream.save();
    },
    pause: function () {
        this.set('paused', true);
        var stream = this.get('model');
        stream.save();
    },
    resume: function () {
        this.set('paused', false);
        var stream = this.get('model');
        stream.save();
    }
  }
});
