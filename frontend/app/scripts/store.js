/* global App */

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: "http://localhost:8888",
  coalesceFindRequests: true
});
// App.ApplicationAdapter = DS.FixtureAdapter.extend();

// TODO: cf. http://discuss.emberjs.com/t/ember-data-fixture-adapter-saving-record-loses-has-many-relationships/2821/3
DS.JSONSerializer.reopen({
  serializeHasMany : function(record, json, relationship) {
    var key = relationship.key;

    var relationshipType = DS.RelationshipChange.determineRelationshipType(
      record.constructor, relationship);

    if (relationshipType === 'manyToNone' || relationshipType === 'manyToMany' || relationshipType === 'manyToOne') {
      if (relationship.options.polymorphic) {
        json[key] = Ember.get(record, key).map(function(item) {
          return {
            id: item.get('id'),
            type: item.constructor.typeKey
          };
        });
      } else {
        json[key] = Ember.get(record, key).mapBy('id');
      }
      // TODO support for polymorphic manyToNone and manyToMany
      // relationships
    }
  }
});
