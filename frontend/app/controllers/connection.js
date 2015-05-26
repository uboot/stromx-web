import Ember from "ember";
import { COLORS, NO_THREAD_COLOR } from 'stromx-web/colors';

export default Ember.Controller.extend({
  color: function() {
    var thread = this.get('model.thread');
    if (thread === undefined || thread == null) {
      return NO_THREAD_COLOR;
    } else {
      return COLORS[thread % COLORS.length].value;
    }
  }.property('model.thread'),
  
  thread: function() {
    var thread = this.get('model.thread');
    if (thread === undefined || thread == null) {
      return 'No thread';
    } else {
      return 'Thread ' + thread;
    }
  }.property('model.thread'),

  title: Ember.computed('model.input', 'model.output', {
    set: function(key, value) {
      return value;
    },
    get: function() {
      var _this = this;
      Ember.RSVP.all([
        this.get('model.input'),
        this.get('model.output')
      ]).then(function(connectors) {
        _this.set('title', connectors[0].get('title') + ' -> ' + connectors[1].get('title'));
      });
    }
  })
});

