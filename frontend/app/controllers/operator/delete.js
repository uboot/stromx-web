import OperatorController from 'stromx-web/controllers/operator';

export default OperatorController.extend({
  wasRemoved: false,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('stream.index', this.get('model.stream'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('operator.index', this.get('model'));
      }
    },
    remove: function () {
      var _this = this;
      this.removeDependencies().then(function() {
        var model = _this.get('model');
        model.deleteRecord();
        model.save();
      });
      this.set('wasRemoved', true);
    }
  }
});
