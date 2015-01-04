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
    equal(find('h1').text(), 'Stream', 'The stream template is shown');
    equal(find('.stromx-stream-svg').length, 1, 'The stream view is shown');
  });
});

test('new operator', function() {
  visit('/streams/2');
  click('a.stromx-new-operator');

  andThen(function() {
    equal(find('select option').length, 4, 'The operator type menu is shown');
  });
});
