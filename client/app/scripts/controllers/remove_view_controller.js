/* global App */

require('scripts/controllers/view_controller');

App.RemoveViewController = App.ViewController.extend({
  actions: {
    accept: function() {
        this.send("remove");
        this.send("closeModal");
    },
    cancel: function() {
        this.send("closeModal");
    }
  }
});
