import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test }from 'qunit';

moduleForAcceptance('Acceptance: InputObservers');

test('visit observer', function(assert) {
  visit('/streams/2/inputObservers/0');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'inputObserver.index',
      'The observer is shown'
    );
  });
});

test('remove observer', function(assert) {
  visit('/streams/2/inputObservers/0/delete');
  click('.stromx-accept');
  waitForModal();

  andThen(function() {
    assert.equal(
      currentURL(),
      '/streams/2/views/1',
      'After removing the observer the former view is shown'
    );
  });
});

test('cancel removing observer', function(assert) {
  visit('/streams/2/inputObservers/0/delete');
  click('.stromx-cancel');
  waitForModal();

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'inputObserver.index',
      'After cancelling the observer is shown'
    );
  });
});

test('edit visualization', function(assert) {
  visit('/streams/2/inputObservers/4');
  click('.stromx-edit-visualization');
  fillIn('#stromx-visualization-select', 'value');
  click('.stromx-save');

  andThen(function() {
    assert.equal(
      find('.stromx-visualization-label').text(),
      'Value',
      'Saving persists the chosen visualization'
    );
  });
});

test('cancel editing visualization', function(assert) {
  visit('/streams/2/inputObservers/4');
  click('.stromx-edit-visualization');
  fillIn('#stromx-visualization-select', 'value');
  click('.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-visualization-label').text(),
      'Point',
      'Cancelling restores the previous visualization'
    );
  });
});

test('edit color', function(assert) {
  visit('/streams/2/inputObservers/0');
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
  visit('/streams/2/inputObservers/0');
  click('.stromx-edit-color');
  click('.stromx-choose-color');
  click('.stromx-color-item:nth-child(2) a');
  click('.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-color-box')[0].getAttribute('style'),
      'background-color: #0000ff',
      'Cancelling restores the previous color'
    );
  });
});
