import OperatorController from 'stromx-web/controllers/operator';

export default OperatorController.extend({
  actions: {
    dismiss: function () {
      this.transitionToRoute('stream.index', this.get('model.stream'));
    },
    remove: function () {
      var view = this.get('model');
      view.deleteRecord();
      view.save();
    }
  }
});
