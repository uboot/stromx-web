App.Router.map(function () {
  this.resource('streams', { path: '/' });
});

App.StreamsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('stream');
  }
});