import FileController from 'stromx-web/controllers/file';

export default FileController.extend({
  actions: {
    accept: function() {
      this.send("remove");
    }
  }
});
