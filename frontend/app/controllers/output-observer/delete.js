import DeleteController from 'stromx-web/controllers/delete-observer';

export default DeleteController.extend({
  wasRemoved: false,
  view: null,
  actions: {
    dismiss: function () {
      if (this.get('wasRemoved')) {
        this.transitionToRoute('view.index', this.get('view'));
        this.set('wasRemoved', false);
      } else {
        this.transitionToRoute('outputObserver.index', this.get('model'));
      }
    }
  }
});
