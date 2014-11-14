import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
var App;

module('File integration tests', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, App.destroy);
  }
});

test('index route', function() {
  expect(1);

  visit('/');
  andThen(function() {
    equal(find('tbody tr').length, 2, 'A list of two files is shown');
  });
});

test('remove file', function() {
  expect(1);

  visit('/');
  click('li:nth-child(3) a');
  click('button.btn-primary');
  andThen(function() {
    equal(find('tbody tr').length, 1, 'A list of one file is shown');
  });
});

test('close stream', function() {
  expect(1);

  visit('/streams/2');
  click('button.close-button');
  andThen(function() {
    equal(find('tbody tr').length, 2, 'A list of two files is shown');
  });
});

