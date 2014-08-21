/* global App, andThen, click, equal, expect, find, test, then, visit */

App.rootElement = '#app-fixture';
App.ApplicationAdapter = DS.FixtureAdapter;
App.setupForTesting();
App.injectTestHelpers();

module('Integration Tests', {
  teardown: function() {
    //App.reset();
  }
});

test('index route', function() {
  expect(1);

  visit('/');
  andThen(function() {
    equal(find('tr').length, 3, 'A list of two files is shown');
  });
});

test('close stream', function() {
  expect(1);

  visit('/streams/2');
  click('button.close-button');
  andThen(function() {
    equal(find('tr').length, 3, 'A list of two files is shown');
  });
});
