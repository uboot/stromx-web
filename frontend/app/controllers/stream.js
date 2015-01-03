import Ember from "ember";

export var Color = {
  RED: '#be202e',
  GREEN: '#019547',
  BLUE: '#2075bc'
};

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
      var _this = this;
      this.get('file').then(function(file) {
        file.set('saved', true);
        file.set('opened', false);
        file.save().then(function() {
          _this.transitionToRoute('files');
        });
      });
    },
    save: function () {
      this.get('file').then(function(file) {
        file.set('saved', true);
        file.save();
      });
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
