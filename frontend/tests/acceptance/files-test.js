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
  click('tr:nth-child(1) a.stromx-rename-file');
  fillIn('input', 'new.stromx');
  click('tr:nth-child(1) button.stromx-save-changes');

  andThen(function() {
    equal(find('tr:nth-child(1) a.stromx-file-name').text(), 'new.stromx',
          'Pressing save after editing the file name saves the changes');
  });
});

test('cancel rename file', function() {
  visit('/');
  click('tr:nth-child(1) a.stromx-rename-file');
  fillIn('input', 'new.stromx');
  click('tr:nth-child(1) button.stromx-discard-changes');

  andThen(function() {
    equal(find('tr:nth-child(1) a.stromx-file-name').text(), 'test.stromx',
          'Pressing cancel after editing the file name leaves it unchanged');
  });
});

