import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var App;

module('Acceptance: Files', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.stromx-file-row').length, 2, 'A list of two files is shown');
  });
});

test('remove file', function(assert) {
  visit('/');
  click('.stromx-file-row:nth-child(2) a.stromx-delete-file');
  click('button.stromx-accept');
  triggerEvent('.modal', 'hidden.bs.modal');

  andThen(function() {
    assert.equal(find('tbody tr').length, 1, 'A list of one file is shown');
    assert.equal(currentRouteName(), 'files.index',
       'After removing the file the file list is shown');
  });
});

test('dismiss remove file', function(assert) {
  visit('/');
  click('.stromx-file-row:nth-child(2) a.stromx-delete-file');
  click('button.stromx-cancel');
  triggerEvent('.modal', 'hidden.bs.modal');

  andThen(function() {
    assert.equal(find('tbody tr').length, 2,
      'Dismissing the delete dialog leaves the file list untouched');
    assert.equal(currentRouteName(), 'files.index',
      'After dismissing the file list is shown');
  });
});

test('rename file', function(assert) {
  visit('/');
  click('.stromx-file-row:nth-child(1) a.stromx-rename-file');
  fillIn('input', 'new.stromx');
  click('tr:nth-child(1) button.stromx-save');

  andThen(function() {
    assert.equal(
       find('.stromx-file-row:nth-child(1) a.stromx-file-name').text(),
      'new.stromx', 
      'Pressing save after editing the file name saves the changes'
    );
  });
});

test('cancel rename file', function(assert) {
  visit('/');
  click('.stromx-file-row:nth-child(1) a.stromx-rename-file');
  fillIn('input', 'new.stromx');
  click('.stromx-file-row:nth-child(1) button.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-file-row:nth-child(1) a.stromx-file-name').text(),
      'test.stromx',
      'Pressing cancel after editing the file name leaves it unchanged'
    );
  });
});

test('new file', function(assert) {
  visit('/new');
  fillIn('#stromx-file-input', 'new.stromx');
  click('button.stromx-save');

  andThen(function() {
    assert.equal(
      find('.stromx-file-row:nth-child(3) a.stromx-file-name').text(),
      'new.stromx',
      'Saving a new file name file adds the file'
    );
    assert.equal(
      currentRouteName(),
      'files.index',
      'After saving a new file the file list is shown'
    );
  });
});

test('cancel new file', function(assert) {
  visit('/new');
  fillIn('#stromx-file-input', 'new.stromx');
  click('button.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-file-row').length,
      2,
      'Cancelling after entering a new file leaves the file list unchanged'
    );
    assert.equal(
      currentRouteName(),
      'files.index',
      'After cancelling the file list is shown'
    );
  });
});

test('upload file', function(assert) {
  visit('/upload');
  click('button.stromx-upload');

  andThen(function() {
    assert.equal(
      find('.stromx-file-row:nth-child(3) a.stromx-file-name').text(),
      '',
      'Uploading a new file name file adds the file'
    );
    assert.equal(
      currentRouteName(),
      'files.index',
      'After uploading a new file the file list is shown'
    );
  });
});

test('cancel uploading new file', function(assert) {
  visit('/upload');
  click('button.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-file-row').length,
      2,
      'Cancelling the file upload leaves the file list unchanged'
    );
    assert.equal(
      currentRouteName(),
      'files.index',
      'After cancelling the file list is shown'
    );
  });
});
