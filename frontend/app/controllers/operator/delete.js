import OperatorController from 'stromx-web/controllers/operator';

export default OperatorController.extend({
  wasRemoved: false,
  stream: null,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('stream.index');
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('operator.index');
      }
    },
    remove: function () {
      // backup the stream
      this.set('stream', this.get('model.stream'));
      
      // delete the operator
      this.get('model').deleteRecord();
      
      // reload the stream to update the connections
      var _this = this;
      this.get('model').save().then(function() {
        _this.reloadConnectionsAndObservers();
      });
      this.set('wasRemoved', true);
    }
  }
});
