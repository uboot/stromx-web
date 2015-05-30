import Ember from "ember";
import ENV from '../config/environment';

export default Ember.Component.extend({
  isEditing: false,
  closed: Ember.computed.not('model.opened'),
  url: function() {
    if (ENV.APP.API_HOST) {
      return ENV.APP.API_HOST + '/download/' + this.get('model.name');
    } else {
      return 'download/' + this.get('model.name');
    }
  }.property(name),
  actions: {
    edit: function() {
      this.set('isEditing', true);
    },
    saveChanges: function() {
      this.set('isEditing', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },
    open: function () {
      this.sendAction('open', this.get('model'));
    }
  }

});
