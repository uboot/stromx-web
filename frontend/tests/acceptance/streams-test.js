import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test }from 'qunit';

moduleForAcceptance('Acceptance: Streams');

test('visit stream', function(assert) {
  visit('/streams/2');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'stream.index',
      'The stream is shown'
    );
  });
});

test('display stream', function(assert) {
  visit('/streams/2');
  click('li:nth-child(3) .stromx-display-view');
  click('.stromx-display-stream');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/streams/2',
      'No view ID is appended as a query parameter to the URL'
    );
  });
});

test('display stream on operator route', function(assert) {
  visit('/streams/2/operators/0');
  click('li:nth-child(3) .stromx-display-view');
  click('.stromx-display-stream');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/streams/2/operators/0',
      'No view ID is appended as a query parameter to the current URL'
    );
  });
});

test('display view', function(assert) {
  visit('/streams/2');
  click('li:nth-child(3) .stromx-display-view');

  andThen(function() {
    assert.equal(
      find('.stromx-view-view').length,
      1,
      'The view template is shown'
    );
    assert.equal(
      currentURL(),
      '/streams/2?view=2',
      'The view ID is appended as a query parameter to the URL'
    );
  });
});

test('display view on operator route', function(assert) {
  visit('/streams/2/operators/0');
  click('li:nth-child(3) .stromx-display-view');

  andThen(function() {
    assert.equal(
      find('.stromx-view-view').length,
      1,
      'The view template is shown'
    );
    assert.equal(
      currentURL(),
      '/streams/2/operators/0?view=2',
      'The view ID is appended as a query parameter to the current URL'
    );
  });
});

test('new view', function(assert) {
  visit('/streams/2');
  click('.stromx-new-view');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'views.new',
      'Clicking the new view button transitions to the according route'
    );
  });
});

test('save stream', function(assert) {
  visit('/streams/2');
  click('.stromx-save-stream');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'stream.index',
      'After saving the stream is shown'
    );
  });
});

test('close stream and save', function(assert) {
  visit('/streams/2');
  click('.stromx-close-stream');
  click('.stromx-accept');
  waitForModal();
  wait();

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'files.index',
      'After closing the stream the file list is shown'
    );
  });
});

test('close stream and do not save', function(assert) {
  visit('/streams/2');
  click('.stromx-close-stream');
  click('.stromx-do-not-accept');
  waitForModal();
  wait();

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'files.index',
      'After closing the stream without saving the file list is shown'
    );
  });
});

test('cancel closing stream', function(assert) {
  visit('/streams/2');
  click('.stromx-close-stream');
  click('.stromx-cancel');
  waitForModal();

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'stream.index',
      'After cancelling the close dialog the stream is shown'
    );
  });
});

test('start stream', function(assert) {
  visit('/streams/2');
  click('.stromx-start-stream');

  andThen(function() {
    assert.ok(
      find('.stromx-pause-stream').length,
      'After starting the stream the pause button is shown'
    );
    assert.ok(
      find('.stromx-stop-stream').length,
      'After starting the stream the stop button is shown'
    );
  });
});

test('stop stream', function(assert) {
  visit('/streams/2');
  click('.stromx-start-stream');
  click('.stromx-stop-stream');

  andThen(function() {
    assert.ok(
      find('.stromx-start-stream').length,
      'After stopping the stream the start button is shown'
    );
  });
});

test('pause stream', function(assert) {
  visit('/streams/2');
  click('.stromx-start-stream');
  click('.stromx-pause-stream');

  andThen(function() {
    assert.ok(
      find('.stromx-resume-stream').length,
      'After pausing the stream the resume button is shown'
    );
  });
});

test('resume stream', function(assert) {
  visit('/streams/2');
  click('.stromx-start-stream');
  click('.stromx-pause-stream');
  click('.stromx-resume-stream');

  andThen(function() {
    assert.ok(
      find('.stromx-stop-stream').length,
      'After resuming the stream the stop button is shown'
    );
  });
});

test('zoom in', function(assert) {
  visit('/streams/2');
  click('.stromx-zoom-in');

  andThen(function() {
    var newWidth = find('.stromx-stream-svg')[0].getAttribute('width');
    assert.ok(newWidth > 1280,
      'Zooming in increases the width of the SVG canvas'
    );
  });
});

test('zoom out', function(assert) {
  visit('/streams/2');
  click('.stromx-zoom-out');

  andThen(function() {
    var newWidth = find('.stromx-stream-svg')[0].getAttribute('width');
    assert.ok(newWidth < 1280,
      'Zooming out decreases the width of the SVG canvas'
    );
  });
});

test('reset zoom', function(assert) {
  visit('/streams/2');
  click('.stromx-zoom-out');
  click('.stromx-reset-zoom');

  andThen(function() {
    var newWidth = find('.stromx-stream-svg')[0].getAttribute('width');
    assert.equal(newWidth, 1280,
      'Zooming out decreases the width of the SVG canvas'
    );
  });
});

test('click a connection', function(assert) {
  visit('/streams/2');
  click('.stromx-svg-connection-path');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'connection.index',
      'Clicking a connection displays its properties'
    );
  });
});

test('click an operator', function(assert) {
  visit('/streams/2');
  click('.stromx-svg-operator-rect');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'operator.index',
      'Clicking an operator displays its properties'
    );
  });
});


test('move an operator', function(assert) {
  visit('/streams/2');
  triggerEvent('.stromx-svg-operator-rect', 'mousedown');
  triggerEvent('.stromx-svg-operator-rect', 'mousemove', {
    clientX: 0,
    clientY: 0
  });
  triggerEvent('.stromx-svg-operator-rect', 'mouseup');

  andThen(function() {
    assert.notEqual(
      find('.stromx-operator-transform')[0].getAttribute('transform'),
      'translate(25 75)',
      'Dragging an operator changes its transform'
    );
  });
});
