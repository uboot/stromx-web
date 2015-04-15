import Ember from 'ember';
import QUnit from 'qunit';
import startApp from '../../helpers/start-app';
import { moduleFor, test } from 'ember-qunit';
import { createRecord } from '../../helpers/stromx-web-helpers';

var App;

moduleFor('controller:view-details', 'ViewController', {
  beforeEach: function() {
    var container = this.container;
    App = startApp();
    DS._setupContainer(container);
    container.register('adapter:application', DS.FixtureAdapter);
  },
  afterEach: function(container) {
    Ember.run(App, 'destroy');
  },
  needs: ['model:operator', 'model:parameter', 'model:input', 'model:output',
    'model:connection', 'model:stream', 'model:enum-description',
    'model:input-observer', 'model:file', 'model:view',
    'model:connector-value', 'model:observer', 'model:parameter-observer',
    'model:input-observer', 'model:view'
  ]
});

test('add input observer', function(assert) {
  var store = this.container.lookup('store:main');

  var inputObserver = createRecord(store, 'inputObserver', {
    zvalue: 1,
  });
  var view = createRecord(store, 'view', {});
  var input = createRecord(store, 'input', {});
  view.get('observers').addObject(inputObserver);

  var controller = this.subject();
  controller.set('model', view);
  Ember.run(function() {
    return controller.addInputObserver(input);
  }).then(function() {
    assert.equal(view.get('observers.length'), 2,
                 'Adding an input observer to the view increases the number of observers');
    var addedObserver = view.get('observers').objectAt(1);
    assert.equal(addedObserver.get('input.id'), input.get('id'),
                 'The input is assigned to the observer');
    assert.equal(addedObserver.get('zvalue'), 2,
                 'A valid z-value is assigned to the new observer');
  });

  wait();
});

test('remove input observer', function(assert) {
  var store = this.container.lookup('store:main');

  var inputObserver1 = createRecord(store, 'inputObserver', {
    zvalue: 1,
  });
  var inputObserver2 = createRecord(store, 'inputObserver', {
    zvalue: 2,
  });
  var view = createRecord(store, 'view', {});
  view.get('observers').addObject(inputObserver1);
  view.get('observers').addObject(inputObserver2);

  var controller = this.subject();
  controller.set('model', view);
  Ember.run(function() {
    return controller.removeObserver(inputObserver1);
  }).then(function() {
    assert.equal(view.get('observers.length'), 1,
                 'Removing an input observer from the view decreases the number of observers');
    assert.equal(inputObserver2.get('zvalue'), 1,
                 'The z-value of the remaining observers is updated');
  });

  wait();
});

