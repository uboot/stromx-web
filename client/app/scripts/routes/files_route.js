App.FilesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('file');
  }
}); 