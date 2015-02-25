import Ember from "ember";

export default Ember.ObjectController.extend({
  needs: ['application'],
  activeOutput: null,
  activeInput: null,
  view: null,
  isVisible: Ember.computed.equal('view', null),

  patternUri: function() {
    return 'url(' + this.get('target.url') + '#grid)';
  }.property('target.url'),

  actions: {
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
    },
    display: function() {
      this.set('view', null);
      this.send('renderDetails', null);
    }
  }
});
