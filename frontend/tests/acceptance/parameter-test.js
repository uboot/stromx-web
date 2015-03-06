import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var App;

module('Acceptance: Parameter', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('decrease the number of matrix rows', function(assert) {
  visit('/streams/2/operators/4/parameters/8/edit');
  fillIn('#num-rows', 2);

  andThen(function() {
    assert.equal(find('table#values tr').length, 2, 'The table has 2 rows');
    assert.equal(find('table#values tr:nth-child(1) input')[0].value, '10',
                 'The entries at the top of the matrix are still the same');
  });
});

test('increase the number of matrix rows', function(assert) {
  visit('/streams/2/operators/4/parameters/8/edit');
  fillIn('#num-rows', 4);

  andThen(function() {
    assert.equal(find('table#values tr').length, 4, 'The table has 4 rows');
    assert.equal(find('table#values tr:nth-child(1) input')[0].value, '10',
                'The first matrix entry is still the same');
    assert.equal(find('table#values tr:nth-child(4) input')[0].value, '0',
                 'The new entries at the end of the matrix are 0');
  });
});

test('decrease the number of matrix cols', function(assert) {
  visit('/streams/2/operators/4/parameters/8/edit');
  fillIn('#num-cols', 2);

  andThen(function() {
    assert.equal(find('table#values tr:nth-child(1) td').length, 2,
                 'The table has 2 columns');
    assert.equal(find('table#values tr:nth-child(1) input')[0].value, '10',
                 'The entries at the right of the matrix are still the same');
  });
});

test('increase the number of matrix cols', function(assert) {
  visit('/streams/2/operators/4/parameters/8/edit');
  fillIn('#num-cols', 6);

  andThen(function() {
    assert.equal(find('table#values tr:nth-child(1) td').length, 6,
                 'The table has 6 columns');
    assert.equal(find('table#values tr:nth-child(3) td:nth-child(6) input')[0].value,
                 '0', 'The new entries at the left of the matrix are 0');
  });
});

