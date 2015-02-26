import Ember from 'ember';

export function createRecord(store, name, properties) {
  return Ember.run(function() {
    return store.createRecord(name, properties);
  });
}