import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: Files', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /', function() {
  visit('/');

  andThen(function() {
    equal(find('tbody tr').length, 2, 'A list of two files is shown');
  });
});

test('remove file', function() {
  visit('/');
  click('li:nth-child(3) a');
  click('button.btn-primary');
  
  andThen(function() {
    equal(find('tbody tr').length, 1, 'A list of one file is shown');
  });
});

test('close stream', function() {
  visit('/streams/2');
  
  click('button.close-button');
  
  andThen(function() {
    equal(find('tbody tr').length, 2, 'A list of two files is shown');
  });
});