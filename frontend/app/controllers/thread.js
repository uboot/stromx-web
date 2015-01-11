import Ember from "ember";
import { Color } from 'stromx-web/controllers/stream';

export default Ember.ObjectController.extend({
  isEditing: false,

  actions: {
    saveChanges: function() {
      this.set('isEditing', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },
    edit: function() {
      this.set('isEditing', true);
    },
    setColor: function(key) {
      var color = Color[key];
      this.set('color', color);
    }
  }
});
