import Ember from "ember";
import { Color } from 'stromx-web/controllers/stream';

export default Ember.ObjectController.extend({
  isEditingName: false,

  actions: {
    saveName: function() {
      var model = this.get('model');
      model.save();
      this.set('isEditingName', false);
    },

    rename: function() {
      this.set('isEditingName', true);
    },

    setColor: function(key) {
      var color = Color[key];
      this.set('color', color);
      
      var model = this.get('model');
      model.save();
    },

    remove: function () {
        var view = this.get('model');
        view.deleteRecord();
        view.save();
    }
  }
});
