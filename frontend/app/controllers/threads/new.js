import Ember from "ember";
import { defaultThreadColor } from 'stromx-web/colors';

export default Ember.Controller.extend({
  name: '',
  actions: {
    cancel: function() {
      this.set('name', '');
      this.transitionToRoute('stream.index', this.get('model'));
    },
    save: function () {
      var stream = this.get('model');
      var name = this.get('name');
      var thread = this.store.createRecord('thread', {
        name: name,
        stream: stream,
        color: defaultThreadColor
      });

      this.set('name', '');
      var _this = this;
      thread.save().then(function(thread) {
        _this.transitionToRoute('thread', thread);
      });
    }
  }
});
