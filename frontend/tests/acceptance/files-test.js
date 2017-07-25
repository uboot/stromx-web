import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test }from 'qunit';

moduleForAcceptance('Acceptance: Files');

test('visit files', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.stromx-file-row').length, 2, 'A list of two files is shown');
  });
});

test('open file', function(assert) {
  visit('/');
  click('.stromx-file-row:nth-child(2) a.stromx-file-name');

  andThen(function() {
    assert.equal(currentRouteName(), 'stream.index',
       'After opening the file the stream in the file is shown');
  });
});

test('remove file', function(assert) {
  visit('/files/2/delete');
  click('button.stromx-accept');

  andThen(function() {
    assert.equal(find('tbody tr').length, 1, 'A list of one file is shown');
    assert.equal(currentRouteName(), 'files.index',
       'After removing the file the file list is shown');
  });
});

test('dismiss remove file', function(assert) {
  visit('/files/2/delete');
  click('button.stromx-cancel');

  andThen(function() {
    assert.equal(find('tbody tr').length, 2,
      'Dismissing the delete dialog leaves the file list untouched');
    assert.equal(currentRouteName(), 'files.index',
      'After dismissing the file list is shown');
  });
});

test('rename file', function(assert) {
  visit('/');
  click('.stromx-file-row:nth-child(2) a.stromx-rename-file');
  fillIn('input', 'new.stromx');
  click('tr:nth-child(2) button.stromx-save');

  andThen(function() {
    assert.equal(
       find('.stromx-file-row:nth-child(2) a.stromx-file-name').text(),
      'new.stromx',
      'Pressing save after editing the file name saves the changes'
    );
  });
});

test('cancel rename file', function(assert) {
  visit('/');
  click('.stromx-file-row:nth-child(2) a.stromx-rename-file');
  fillIn('input', 'new.stromx');
  click('.stromx-file-row:nth-child(2) button.stromx-cancel');

  andThen(function() {
    assert.equal(
      find('.stromx-file-row:nth-child(2) a.stromx-file-name').text(),
      'hough.stromx',
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
