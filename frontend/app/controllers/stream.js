import Ember from "ember";

export default Ember.Controller.extend({
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
      this.get('model.file').then(function(file) {
        file.set('saved', true);
        file.save();
      });
    },
    start: function () {
        var stream = this.get('model');
        stream.set('active', true);
        stream.save();
    },
    stop: function () {
        var stream = this.get('model');
        stream.set('active', false);
        stream.save();
    },
    pause: function () {
        var stream = this.get('model');
        stream.set('paused', true);
        stream.save();
    },
    resume: function () {
        var stream = this.get('model');
        stream.set('paused', false);
        stream.save();
    },
    display: function() {
      this.set('view', null);
      this.send('renderDetails', null);
    }
  }
});
