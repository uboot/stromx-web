import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var App;

module('Acceptance: Operators', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit operator', function(assert) {
  visit('/streams/2/operators/0');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'operator.index',
      'The operator is shown'
    );
  });
});

test('initialize operator', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-initialize-operator');

  andThen(function() {
    assert.ok(
      find('.stromx-deinitialize-operator').length,
      'After initializing the operator the deinitialize button is shown'
    );
  });
});

test('deinitialize operator', function(assert) {
  visit('/streams/2/operators/0');
  click('.stromx-deinitialize-operator');

  andThen(function() {
    assert.ok(
      find('.stromx-initialize-operator').length,
      'After deinitializing the operator the initialize button is shown'
    );
  });
});

test('remove operator', function(assert) {
  visit('/streams/2/operators/0/delete');
  click('.stromx-accept');
  waitForModal();

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'stream.index',
      'After removing the operator the stream is shown'
    );
  });
});

test('cancel removing operator', function(assert) {
  visit('/streams/2/operators/0/delete');
  click('.stromx-cancel');
  waitForModal();

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'operator.index',
      'After cancelling the operator is shown'
    );
  });
});

test('rename operator', function(assert) {
  visit('/streams/2/operators/0');
  click('.stromx-rename-operator');
  fillIn('#stromx-operator-name-input', 'New name');
  click('.stromx-save');

  andThen(function() {
    assert.equal(
      find('.stromx-operator-name').text(),
      'New name',
      'Renaming the operator changes its name'
    );
  });
});

test('cancel renaming operator', function(assert) {
  visit('/streams/2/operators/0');
  click('.stromx-rename-operator');
  fillIn('#stromx-operator-name-input', 'New name');
  click('.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-operator-name').text(),
      'Generate numbers',
      'Cancelling restores the previous operator name'
    );
  });
});

test('show input observer', function(assert) {
  visit('/streams/2/operators/1');
  click('.stromx-input-row:nth-child(1) .stromx-edit-input-observer');
  fillIn('.stromx-views-select', 1);
  click('.stromx-show-input-observer');
  
  andThen(function() {
    assert.equal(
      currentRouteName(),
      'inputObserver.index',
      'Showing the observer of an input transitions to the input observer'
    );
  });
});

test('add input observer', function(assert) {
  visit('/streams/2/operators/2');
  click('.stromx-input-row:nth-child(1) .stromx-edit-input-observer');
  fillIn('.stromx-views-select', 2);
  click('.stromx-add-input-observer');
  
  andThen(function() {
    assert.equal(
      currentRouteName(),
      'inputObserver.index',
      'Adding an input observer transitions to the input observer'
    );
  });
});

test('cancel editing input', function(assert) {
  visit('/streams/2/operators/1');
  click('.stromx-input-row:nth-child(1) .stromx-edit-input-observer');
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.form-group').length,
      0,
      'Clicking cancel when editing an input removes the edit form'
    );
    assert.equal(
      currentRouteName(),
      'operator.index',
      'Clicking cancel when editing an input does not change the route'
    );
  });
});

test('editing an input and adding a view', function(assert) {
  visit('/streams/3/operators/3');
  click('.stromx-input-row:nth-child(1) .stromx-edit-input-observer');
  click('.stromx-new-view');
  
  andThen(function() {
    assert.equal(
      currentRouteName(),
      'views.new',
      'Clicking new when editing an input with no views transitions to the new view route'
    );
  });
});

test('cancelling adding a new view when editing an input', function(assert) {
  visit('/streams/3/operators/3');
  click('.stromx-input-row:nth-child(1) .stromx-edit-input-observer');
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.form-group').length,
      0,
      'Clicking cancel when editing an input without views removes the edit form'
    );
    assert.equal(
      currentRouteName(),
      'operator.index',
      'Clicking cancel when editing an input without views does not change the route'
    );
  });
});

test('show output observer', function(assert) {
  visit('/streams/2/operators/0');
  click('.stromx-output-row:nth-child(1) .stromx-edit-output-observer');
  fillIn('.stromx-views-select', 2);
  click('.stromx-show-output-observer');
  
  andThen(function() {
    assert.equal(
      currentRouteName(),
      'outputObserver.index',
      'Showing the observer of an output transitions to the output observer'
    );
  });
});

test('add output observer', function(assert) {
  visit('/streams/2/operators/2');
  click('.stromx-output-row:nth-child(1) .stromx-edit-output-observer');
  fillIn('.stromx-views-select', 2);
  click('.stromx-add-output-observer');
  
  andThen(function() {
    assert.equal(
      currentRouteName(),
      'outputObserver.index',
      'Adding an output observer transitions to the output observer'
    );
  });
});

test('cancel editing output', function(assert) {
  visit('/streams/2/operators/0');
  click('.stromx-output-row:nth-child(1) .stromx-edit-output-observer');
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.form-group').length,
      0,
      'Clicking cancel when editing an output removes the edit form'
    );
    assert.equal(
      currentRouteName(),
      'operator.index',
      'Clicking cancel when editing an output does not change the route'
    );
  });
});

test('editing an output and adding a view', function(assert) {
  visit('/streams/3/operators/3');
  click('.stromx-output-row:nth-child(1) .stromx-edit-output-observer');
  click('.stromx-new-view');
  
  andThen(function() {
    assert.equal(
      currentRouteName(),
      'views.new',
      'Clicking new when editing an output with no views transitions to the new view route'
    );
  });
});

test('cancelling adding a new view when editing an output', function(assert) {
  visit('/streams/3/operators/3');
  click('.stromx-output-row:nth-child(1) .stromx-edit-output-observer');
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.form-group').length,
      0,
      'Clicking cancel when editing an output without views removes the edit form'
    );
    assert.equal(
      currentRouteName(),
      'operator.index',
      'Clicking cancel when editing an output without views does not change the route'
    );
  });
});

test('read-only parameter', function(assert) {
  visit('/streams/2/operators/2');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(1) .stromx-edit-parameter').length,
      0,
      'A read-only parameter has no edit button'
    );
  });
});

test('writable parameter', function(assert) {
  visit('/streams/2/operators/2');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(2) .stromx-edit-parameter').length,
      1,
      'A writable parameter has an edit button'
    );
  });
});

test('reload timed out parameter', function(assert) {
  visit('/streams/2/operators/2');
  click('.stromx-parameter-row:nth-child(3) .stromx-reload-parameter');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(3) .stromx-reload-parameter').length,
      1,
      'A timed out parameter can be reloaded'
    );
  });
});

test('reload inaccessible parameter', function(assert) {
  visit('/streams/2/operators/2');
  click('.stromx-parameter-row:nth-child(3) .stromx-reload-parameter');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(5) .stromx-reload-parameter').length,
      1,
      'An inaccessible parameter can be reloaded'
    );
  });
});

test('editing a float parameter', function(assert) {
  visit('/streams/2/operators/2');
  click('.stromx-parameter-row:nth-child(2) .stromx-edit-parameter');
  fillIn('.stromx-parameter-input', 77.7);
  click('.stromx-save');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(2) .stromx-parameter-value').text(),
      '77.7',
      'Editing and saving a parameter changes its value'
    );
  });
});

test('cancel editing a float parameter', function(assert) {
  visit('/streams/2/operators/2');
  click('.stromx-parameter-row:nth-child(2) .stromx-edit-parameter');
  fillIn('.stromx-parameter-input', 77.7);
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(2) .stromx-parameter-value').text(),
      '2.50',
      'Clicking cancel when editing a parameter restores its value'
    );
  });
});

test('editing an integer parameter', function(assert) {
  visit('/streams/2/operators/1');
  click('.stromx-parameter-row:nth-child(1) .stromx-edit-parameter');
  fillIn('.stromx-parameter-input', 8080);
  click('.stromx-save');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(1) .stromx-parameter-value').text(),
      '8080',
      'Editing and saving a parameter changes its value'
    );
  });
});

test('cancel editing an integer parameter', function(assert) {
  visit('/streams/2/operators/1');
  click('.stromx-parameter-row:nth-child(1) .stromx-edit-parameter');
  fillIn('.stromx-parameter-input', 8080);
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(1) .stromx-parameter-value').text(),
      '50123',
      'Clicking cancel when editing a parameter restores its value'
    );
  });
});

test('editing a string parameter', function(assert) {
  visit('/streams/3/operators/3');
  click('.stromx-parameter-row:nth-child(1) .stromx-edit-parameter');
  fillIn('.stromx-parameter-input', 'stromx.org');
  click('.stromx-save');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(1) .stromx-parameter-value').text(),
      'stromx.org',
      'Editing and saving a parameter changes its value'
    );
  });
});

test('cancel editing a string parameter', function(assert) {
  visit('/streams/3/operators/3');
  click('.stromx-parameter-row:nth-child(1) .stromx-edit-parameter');
  fillIn('.stromx-parameter-input', 'stromx.org');
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(1) .stromx-parameter-value').text(),
      'localhost',
      'Clicking cancel when editing a parameter restores its value'
    );
  });
});

test('editing an enum parameter', function(assert) {
  visit('/streams/2/operators/2');
  click('.stromx-parameter-row:nth-child(6) .stromx-edit-parameter');
  fillIn('.stromx-parameter-select', 7);
  click('.stromx-save');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(6) .stromx-parameter-value').text(),
      'Gaussian',
      'Editing and saving a parameter changes its value'
    );
  });
});

test('cancel editing an enum parameter', function(assert) {
  visit('/streams/2/operators/2');
  click('.stromx-parameter-row:nth-child(6) .stromx-edit-parameter');
  fillIn('.stromx-parameter-select', 7);
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(6) .stromx-parameter-value').text(),
      'Circle',
      'Clicking cancel when editing a parameter restores its value'
    );
  });
});

test('matrix parameter', function(assert) {
  visit('/streams/2/operators/4');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(1) .stromx-parameter-value').text(),
      '3 x 4 matrix',
      'The size of a matrix parameter is shown as its value'
    );
  });
});

test('editing a matrix parameter', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-parameter-row:nth-child(1) .stromx-edit-parameter');
  
  andThen(function() {
    assert.equal(
      currentRouteName(),
      'parameter.edit',
      'Editing a matrix parameter transitions to the edit parameter route'
    );
  });
});

test('unknown variant parameter', function(assert) {
  visit('/streams/2/operators/4');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(2) .stromx-parameter-value').text(),
      '',
      'The value of an parameter with an unknown variant is displayed as an empty string'
    );
  });
});

test('send trigger', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-parameter-row:nth-child(3) .stromx-edit-parameter');
  click('.stromx-send-trigger');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(3) .stromx-parameter-value').text(),
      'Trigger',
      'A trigger parameter can be sent'
    );
  });
});

test('cancel sending a trigger', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-parameter-row:nth-child(3) .stromx-edit-parameter');
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.form-group').length,
      0,
      'Clicking cancel when editing a trigger parameter closes the edit form'
    );
  });
});

test('cancel editing a bool parameter', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-parameter-row:nth-child(4) .stromx-edit-parameter');
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(4) .stromx-parameter-value').text(),
      'Inactive',
      'Clicking cancel when editing a bool parameter restores its previous value'
    );
  });
});

test('activate a bool parameter', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-parameter-row:nth-child(4) .stromx-edit-parameter');
  click('.stromx-activate');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(4) .stromx-parameter-value').text(),
      'Active',
      'Activating a bool parameter sets its value to active'
    );
  });
});

test('deactivate a bool parameter', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-parameter-row:nth-child(5) .stromx-edit-parameter');
  click('.stromx-deactivate');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(5) .stromx-parameter-value').text(),
      'Inactive',
      'Deactivating a bool parameter sets its value to inactive'
    );
  });
});

test('image parameter', function(assert) {
  visit('/streams/2/operators/4');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(6) .stromx-parameter-value').text(),
      '200 x 300 image',
      'The size of an image parameters is shown as its value'
    );
  });
});

test('edit image parameter', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-parameter-row:nth-child(6) .stromx-edit-parameter');
  click('.stromx-save');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(6) .stromx-parameter-value').text(),
      '200 x 300 image',
      'A file can be uploaded to change an image parameter'
    );
  });
});

test('cancel editing image parameter', function(assert) {
  visit('/streams/2/operators/4');
  click('.stromx-parameter-row:nth-child(6) .stromx-edit-parameter');
  click('.stromx-cancel');
  
  andThen(function() {
    assert.equal(
      find('.stromx-parameter-row:nth-child(6) .stromx-parameter-value').text(),
      '200 x 300 image',
      'Clicking cancel when editing an image parameter does not change its value'
    );
  });
});