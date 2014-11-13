import DS from "ember-data";
import Ember from 'ember';
 
// TODO: cf. http://discuss.emberjs.com/t/ember-data-fixture-adapter-saving-record-loses-has-many-relationships/2821/3
export default DS.JSONSerializer.extend({
  serializeHasMany : function(record, json, relationship) {
    var key = relationship.key;

    if (relationship.kind === 'hasMany') {
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
