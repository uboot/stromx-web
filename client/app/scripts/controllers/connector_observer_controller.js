/* global App */

require('scripts/controllers/observer_controller');

App.ConnectorObserverController = App.ObserverController.extend({
  valueContent: function() {
    var value = this.get('value');

    return value.then( function(value) {
      if (value.get('length') === 0)
        return;

      var value = value.objectAt(0);
      return value.get('content');
    });
  }.property('value.content')
});
