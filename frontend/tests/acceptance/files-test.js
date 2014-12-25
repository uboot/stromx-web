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
  click('a.stromx-delete-file');
  click('button.btn-primary');

  andThen(function() {
    equal(find('tbody tr').length, 1, 'A list of one file is shown');
  });
});

test('rename file', function() {
  visit('/');
  click('tr:nth-child(1) button.stromx-rename-file');
  fillIn('input', 'new.stromx');
  keyEvent('input', 'keyup', 13); // press enter

  andThen(function() {
    equal(find('tr:nth-child(1) div.stromx-file-name a').text(), 'new.stromx',
          'Pressing the enter while editing the file name saves the changes');
  });
});

test('cancel rename file', function() {
  visit('/');
  click('tr:nth-child(1) button.stromx-rename-file');
  fillIn('input', 'new.stromx');
  keyEvent('input', 'keyup', 27); // press escape

  andThen(function() {
    equal(find('tr:nth-child(1) div.stromx-file-name a').text(), 'test.stromx',
          'Pressing escape while editing the file name leaves it unchanged');
  });
});

test('close stream', function() {
  visit('/streams/2');

  click('button.close-button');

  andThen(function() {
    equal(find('tbody tr').length, 2, 'A list of two files is shown');
  });
});
