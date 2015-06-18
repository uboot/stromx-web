import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var App;

module('Acceptance: Views', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit view', function(assert) {
  visit('/streams/2/views/1');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'view.index',
      'The view is shown'
    );
  });
});

test('remove view', function(assert) {
  visit('/streams/2/views/1/delete');
  click('.stromx-accept');
  triggerEvent('.modal', 'hidden.bs.modal');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'stream.index',
      'After removing the view the stream is shown'
    );
  });
});

test('remove view while view details are displayed', function(assert) {
  visit('/streams/2/views/1/delete?view=1');
  click('.stromx-accept');
  triggerEvent('.modal', 'hidden.bs.modal');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/streams/2',
      'After removing the view the stream details are shown'
    );
  });
});

test('add view', function(assert) {
  visit('/streams/2/views/new');
  fillIn('#stromx-view-input', 'New view');
  click('.stromx-save');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'view.index',
      'The view is shown'
    );
    assert.equal(
      find('li:nth-child(4) .stromx-display-view')[0].text.trim(),
      'New view',
      'The view tab is shown'
    );
    assert.equal(
      find('.stromx-display-list li:nth-child(4)')[0].getAttribute('class'),
      '',
      'The view tab is not active'
    );
  });
});

test('cancel removing view', function(assert) {
  visit('/streams/2/views/1/delete');
  click('.stromx-cancel');
  triggerEvent('.modal', 'hidden.bs.modal');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'view.index',
      'After cancelling the view is shown'
    );
  });
});

test('rename view', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-rename-view');
  fillIn('#stromx-view-name-input', 'New name');
  click('.stromx-save');

  andThen(function() {
    assert.equal(
      find('.stromx-view-name').text(),
      'New name',
      'Renaming the operator changes its name'
    );
  });
});

test('cancel renaming view', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-rename-view');
  fillIn('#stromx-view-name-input', 'New name');
  click('.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-view-name').text(),
      'Main view',
      'Cancelling restores the previous operator name'
    );
  });
});

test('show output observer', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-observer-row:nth-child(2) a');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'outputObserver.index',
      'Clicking an output observer shows its properties'
    );
  });
});

test('show parameter observer', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-observer-row:nth-child(4) a');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'parameterObserver.index',
      'Clicking a parameter observer shows its properties'
    );
  });
});

test('show input observer', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-observer-row:nth-child(5) a');

  andThen(function() {
    assert.equal(
      currentRouteName(),
      'inputObserver.index',
      'Clicking an input observer shows its properties'
    );
  });
});

test('move up', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-observer-row:nth-child(3) .stromx-move-up');

  andThen(function() {
    assert.equal(
      find('.stromx-observer-row:nth-child(3) a').text().trim(),
      'Output image at Blur the image',
      'Moving an observer up does not change its position after reload'
    );
  });
});

test('move up first observer', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-observer-row:nth-child(1) .stromx-move-up');

  andThen(function() {
    assert.equal(
      find('.stromx-observer-row:nth-child(1) a').text().trim(),
      'Input image at Blur the image',
      'Moving an observer up does not change its position after reload'
    );
  });
});

test('move down observer', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-observer-row:nth-child(3) .stromx-move-up');

  andThen(function() {
    assert.equal(
      find('.stromx-observer-row:nth-child(3) a').text().trim(),
      'Output image at Blur the image',
      'Moving an observer up does not change its position after reload'
    );
  });
});

test('move down last observer', function(assert) {
  visit('/streams/2/views/1');
  click('.stromx-observer-row:nth-child(6) .stromx-move-up');

  andThen(function() {
    assert.equal(
      find('.stromx-observer-row:nth-child(6) a').text().trim(),
      'Number at Send numbers',
      'Moving an observer up does not change its position after reload'
    );
  });
});

test('display image', function(assert) {
  visit('/streams/2?view=1');

  andThen(function() {
    assert.equal(
      find('svg image').length,
      1,
      'An image is displayed'
    );
  });
});

test('display polygon list', function(assert) {
  visit('/streams/2?view=1');

  andThen(function() {
    assert.equal(
      find('svg polygon').length,
      2,
      'Two polygons are displayed'
    );
    assert.equal(
      find('svg polygon')[0].getAttribute('stroke'),
      '#00ff00',
      'Their color is green'
    );
  });
});

test('display lines', function(assert) {
  visit('/streams/2?view=1');

  andThen(function() {
    assert.equal(
      find('svg line').length,
      3,
      'Three lines are displayed'
    );
    assert.equal(
      find('svg line')[0].getAttribute('stroke'),
      '#0000ff',
      'Their color is blue'
    );
  });
});

test('display rectangles', function(assert) {
  visit('/streams/2?view=2');

  andThen(function() {
    assert.equal(
      find('g:not([transform]) > rect').length,
      2,
      'Two rectangles without transformation are displayed'
    );
    assert.equal(
      find('g:not([transform]) > rect')[0].getAttribute('stroke'),
      '#00ffff',
      'Their color is cyan'
    );
  });
});

test('display rotated rectangles', function(assert) {
  visit('/streams/2?view=2');

  andThen(function() {
    assert.equal(
      find('g[transform] > rect').length,
      2,
      'Two rectangles within a transformation group are displayed'
    );
    assert.equal(
      find('g[transform] > rect')[0].getAttribute('stroke'),
      '#ff00ff',
      'Their color is magenta'
    );
    assert.equal(
      find('g[transform]')[0].getAttribute('transform'),
      'rotate(20 100 50)',
      'The first rectangle is rotated by 20 degrees (counter-clockwise) around its center'
    );
  });
});

test('display polyline', function(assert) {
  visit('/streams/2?view=2');

  andThen(function() {
    assert.equal(
      find('svg polyline').length,
      1,
      'A polyline is displayed'
    );
    assert.equal(
      find('svg polyline')[0].getAttribute('stroke'),
      '#ff0000',
      'Its color is red'
    );
  });
});

test('display points', function(assert) {
  visit('/streams/2?view=1');

  andThen(function() {
    assert.equal(
      find('svg circle').length,
      4,
      'Four circles are displayed'
    );
    assert.equal(
      find('svg circle')[0].getAttribute('fill'),
      '#ff0000',
      'Their color is red'
    );
  });
});

test('display text', function(assert) {
  visit('/streams/2?view=1');

  andThen(function() {
    assert.equal(
      find('.stromx-observer-value-text').length,
      1,
      'One text value is displayed'
    );
  });
});
