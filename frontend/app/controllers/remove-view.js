import { ViewController } from 'stromx-web/controllers/view';

export default ViewController.extend({
  actions: {
    accept: function() {
      this.send("remove");
    }
  }
});
