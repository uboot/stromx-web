import ThreadController from 'stromx-web/controllers/thread';

export default ThreadController.extend({
  actions: {
    accept: function() {
      this.send("remove");
    }
  }
});
