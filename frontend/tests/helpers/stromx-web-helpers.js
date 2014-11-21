import Ember from 'ember';
import {
  moduleFor
} from 'ember-qunit';

export function moduleForController(name, description, callbacks) {
  moduleFor('controller:' + name, description, callbacks, function(container, context, defaultSubject) {
    if (DS._setupContainer) {
      DS._setupContainer(container);
    } else {
      container.register('store:main', DS.Store);
    }

    var adapterFactory = container.lookupFactory('adapter:application');
    if (!adapterFactory) {
      container.register('adapter:application', DS.FixtureAdapter);
    }

    context.__setup_properties__.store = function(){
      return container.lookup('store:main');
    };
  });
}

export function createRecord(store, name, properties) {
  return Ember.run(function() {
    return store.createRecord(name, properties);
  });
}