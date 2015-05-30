import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var App;

module('Acceptance: OutputObservers', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit observer', function(assert) {
  visit('/streams/2/outputObservers/3');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'outputObserver.index',
      'The observer is shown'
    );
  });
});

test('remove observer', function(assert) {
  visit('/streams/2/outputObservers/3/delete');
  click('.stromx-accept');
  waitForModal();

  andThen(function() {
    assert.equal(
      currentURL(),
      '/streams/2/views/1',
      'After removing the observer the former parent view is shown'
    );
  });
});

test('cancel removing observer', function(assert) {
  visit('/streams/2/outputObservers/3/delete');
  click('.stromx-cancel');
  waitForModal();

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'outputObserver.index',
      'After cancelling the observer is shown'
    );
  });
});

test('edit visualization', function(assert) {
  visit('/streams/2/outputObservers/3');
  click('.stromx-edit-visualization');
  fillIn('#stromx-visualization-select', 'polygon');
  click('.stromx-save');

  andThen(function() {
    assert.equal(
      find('.stromx-visualization-label').text(),
      'Polygon',
      'Saving persists the chosen visualization'
    );
  });
});

test('cancel editing visualization', function(assert) {
  visit('/streams/2/outputObservers/3');
  click('.stromx-edit-visualization');
  fillIn('#stromx-visualization-select', 'polygons');
  click('.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-visualization-label').text(),
      'Default',
      'Cancelling restores the previous visualization'
    );
  });
});

test('edit color', function(assert) {
  visit('/streams/2/outputObservers/3');
  click('.stromx-edit-color');
  click('.stromx-choose-color');
  click('.stromx-color-item:nth-child(2) a');
  click('.stromx-save');

  andThen(function() {
    assert.equal(
      find('.stromx-color-box')[0].getAttribute('style'),
      'background-color: #019547',
      'Saving persists the chosen color'
    );
  });
});

test('cancel editing color', function(assert) {
  visit('/streams/2/outputObservers/3');
  click('.stromx-edit-color');
  click('.stromx-choose-color');
  click('.stromx-color-item:nth-child(2) a');
  click('.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-color-box')[0].getAttribute('style'),
      'background-color: #ff0000',
      'Cancelling restores the previous color'
    );
  });
});
