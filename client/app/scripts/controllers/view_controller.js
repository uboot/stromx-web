/* global App */

App.ViewController = Ember.ObjectController.extend({
  sortedConnectorObservers: function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
        content: this.get('connectorObservers'),
        sortProperties: ['zvalue'],
        sortAscending: true
    });
  }.property('connectorObservers')
});
