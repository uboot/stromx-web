import OperatorSvgController from 'stromx-web/controllers/operator-svg';

export default OperatorSvgController.extend({
  wasRemoved: false,
  actions: {
    dismiss: function () {
      this.transitionToRoute('files');
    },
    save: function () {
      this.get('file').then(function(file) {
        file.set('saved', true);
        file.set('opened', false);
        file.save();
      });
    }
  }
});
