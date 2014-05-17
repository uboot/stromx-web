App.RemoveFileModalController = App.FileController.extend({  
  actions: {
    accept: function() {
        this.send("remove")
        this.send("closeModal")
    }, 
    cancel: function() {
        this.send("closeModal")
    }
  }
});
