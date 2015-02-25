import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: Stream', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /streams/2', function() {
  visit('/streams/2');

  andThen(function() {
    equal(find('h3').text(), 'Stream', 'The stream template is shown');
    equal(find('.stromx-stream-svg').length, 1, 'The stream view is shown');
  });
});

test('new operator', function() {
  visit('/streams/2');
  click('a#new-operator');

  andThen(function() {
    equal(find('select option').length, 4, 'The operator type menu is shown');
  });
});

test('remove connection', function() {
  visit('/streams/2/connections/2/delete');
  click('button#accept');

  andThen(function() {
    equal(find('.stromx-svg-connection-path').length, 1,
          'Only one connection is shown');
  });
});

test('add connection', function() {
  visit('/streams/2');
  triggerEvent('a[href="/streams/2/operators/0"] + g', 'mousedown');
  triggerEvent('a[href="/streams/2/operators/2"] + g', 'mouseenter');
  triggerEvent('a[href="/streams/2/operators/0"] + g', 'mouseup');

  andThen(function() {
    equal(find('.stromx-svg-connection-path').length, 3,
          'Three connections are shown');
  });
});

test('remove and add connection', function() {
  visit('/streams/2/connections/2/delete');
  click('button#accept');
  
  triggerEvent('a[href="/streams/2/operators/0"] + g', 'mousedown');
  triggerEvent('a[href="/streams/2/operators/2"] + g', 'mouseenter');
  triggerEvent('a[href="/streams/2/operators/0"] + g', 'mouseup');

  andThen(function() {
    equal(find('.stromx-svg-connection-path').length, 2,
          'Two connections are shown');
  });
});