/* global App */

require('scripts/controllers/file_controller');

App.RemoveFileController = App.FileController.extend({
  actions: {
    accept: function() {
      this.send("remove");
    }
  }
});
