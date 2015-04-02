import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var App;

module('Acceptance: Stream', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /streams/2', function(assert) {
  visit('/streams/2');

  andThen(function() {
    assert.equal(find('h3').text(), 'Stream', 'The stream template is shown');
    assert.equal(find('.stromx-stream-svg').length, 1, 'The stream view is shown');
  });
});

test('display view', function(assert) {
  visit('/streams/2');
  click('.stromx-nav-tabs li:nth-child(2) a');

  andThen(function() {
    assert.equal(find('.stromx-view-view').length, 1,
                 'The view template is shown');
  });
});

test('new operator', function(assert) {
  visit('/streams/2');
  click('a#new-operator');

  andThen(function() {
    assert.equal(find('select option').length, 4,
                 'The operator type menu is shown');
  });
});

test('remove connection', function(assert) {
  visit('/streams/2/connections/2/delete');
  click('button#accept');

  andThen(function() {
    assert.equal(find('.stromx-svg-connection-path').length, 1,
                 'Only one connection is shown');
  });
});

test('add connection', function(assert) {
  visit('/streams/2');
  triggerEvent('a[href="/streams/2/operators/0"] + g', 'mousedown');
  triggerEvent('a[href="/streams/2/operators/2"] + g', 'mouseenter');
  triggerEvent('a[href="/streams/2/operators/0"] + g', 'mouseup');

  andThen(function() {
    assert.equal(find('.stromx-svg-connection-path').length, 3,
                 'Three connections are shown');
  });
});

/*test('remove and add connection', function(assert) {
  visit('/streams/2/connections/2/delete');
  click('button#accept');
  
  triggerEvent('a[href="/streams/2/operators/0"] + g', 'mousedown');
  triggerEvent('a[href="/streams/2/operators/2"] + g', 'mouseenter');
  triggerEvent('a[href="/streams/2/operators/0"] + g', 'mouseup');

  andThen(function() {
    assert.equal(find('.stromx-svg-connection-path').length, 2,
                 'Two connections are shown');
  });
});*/