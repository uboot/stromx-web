import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:operator', 'OperatorController', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['model:operator']
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

test('deinitialize', function() {
  var controller = this.subject();
  controller.set('model', Ember.ObjectProxy.create({
    status: 'initialized',
    saved: false,
    save: function() {
      this.saved = true;
    },
    inputs: Ember.RSVP.resolve(Ember.ArrayProxy.create([
      Ember.ObjectProxy.create({
        connection: Ember.RSVP.resolve(Ember.ObjectProxy.create({
          deleteRecord: function(){}
        }))
      })
    ]))
  }));

  controller.get('inputs').then(function(inputs) {
    console.log(inputs);
  });

  controller.send('deinitialize');
  equal(controller.get('model.status'), 'none',
    'Deinitializing a controller sets the status of its model to none');
  ok(controller.get('model.saved'),
    'Deinitializing a controller saves its model');
});
