/* global App, test, ok */

App.rootElement = '#app-fixture';
App.setupForTesting();
App.injectTestHelpers();

module('Integration Tests', {
  teardown: function() {
    App.reset();
  }
});

test('start test', function() {
  expect(1);

  visit('/');
  andThen(function() {
    equal(find('tr').length, 3, 'A list of two files is shown');
  });
});
