App.ErrorController = Ember.ObjectController.extend({
  time: function(key, value) {
    var model = this.get('model')
    time = model.get('time')
    return time.toLocaleTimeString()
  }.property('model.time')
});