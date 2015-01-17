import OperatorSvgController from 'stromx-web/controllers/operator-svg';

export default OperatorSvgController.extend({
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
      this.removeConnections().then(function() {
        var model = _this.get('model');
        model.deleteRecord();
        model.save();
      });
      this.set('wasRemoved', true);
    }
  }
});
