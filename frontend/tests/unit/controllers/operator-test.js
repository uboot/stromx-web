import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:operator', 'OperatorController', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('initialize', function() {
  var controller = this.subject();
  controller.set('model', Ember.ObjectProxy.create({
    status: 'none',
    saved: false,
    save: function() {
      this.saved = true;
    }
  }));
  
  controller.send('initialize');
  equal(controller.get('model.status'), 'initialized',
    'Initializing a controller sets the status of its model to initialized');
  ok(controller.get('model.saved'),
    'Initializing a controller saves its model');
});
