import Ember from 'ember';
import QUnit from 'qunit';
import startApp from '../../helpers/start-app';
import { moduleFor, test } from 'ember-qunit';
import { createRecord } from '../../helpers/stromx-web-helpers';

var App;

moduleFor('controller:operator', 'OperatorController', {
  beforeEach: function() {
    var container = this.container;
    App = startApp();
    DS._setupContainer(container);
    container.register('adapter:application', DS.FixtureAdapter);
  },
  afterEach: function(container) {
    Ember.run(App, 'destroy');
  },
  needs: ['model:operator', 'model:parameter', 'model:input', 'model:output',
  'model:connection', 'model:stream', 'model:enum-description',
  'model:input-observer', 'model:file', 'model:view', 'model:thread',
  'model:connector-value', 'model:observer', 'model:parameter-observer']
});

test('initialize', function(assert) {
  var store = this.container.lookup('store:main');

  var operator = createRecord(store, 'operator', {
    status: 'none'
  });

  var controller = this.subject();
  Ember.run(function() {
    return operator.save();
  }).then(function(operator) {
    controller.set('model', operator);
    controller.send('initialize');
    assert.equal(controller.get('model.status'), 'initialized',
                 "Initializing a controller sets the status of its model to " + 
                 "'initialized'");
    assert.ok(operator.get('isSaving'),
              'Deinitializing an operator saves its model');
  });

  wait();
});

test('deinitialize', function(assert) {
  var store = this.container.lookup('store:main');
  var operator = createRecord(store, 'operator', {
    status: 'initialized'
  });

  var controller = this.subject();
  Ember.run(function() {
    return operator.save();
  }).then(function(operator) {
    controller.set('model', operator);
    controller.send('deinitialize');

    Ember.run.schedule('destroy', this, function(){
      assert.equal(operator.get('status'), 'none',
                   "Deinitializing an operator sets the status of its model " +
                   "to 'none'");
      assert.ok(operator.get('isSaving'), 'Deinitializing an operator saves its model');
    });
  });

  wait();
});

var setupConnection = function(store, noIncoming, noOutgoing) {
  var stream = createRecord(store, 'stream');
  var operator = createRecord(store, 'operator');
  var sourceOutput = createRecord(store, 'output');
  var targetInput = createRecord(store, 'input');
  var output = createRecord(store, 'output', { operator: operator });
  var input = createRecord(store, 'input', { operator: operator });

  var inConnectionTarget = noIncoming ? targetInput : input;
  var inConnection = createRecord(store, 'connection', {
    stream: stream,
    input: inConnectionTarget,
    output: sourceOutput
  });

  var outConnectionSource = noOutgoing ? sourceOutput : output;
  var outConnection = createRecord(store, 'connection', {
    stream: stream,
    input: targetInput,
    output: outConnectionSource
  });

  var promises = Ember.run(function() {
    return {
      stream: stream.save(),
      operator: operator.save(),
      sourceOutput: sourceOutput.save(),
      output: output.save(),
      input: input.save(),
      inConnection: inConnection.save(),
      outConnection: outConnection.save()
    };
  });

  return Ember.RSVP.hash(promises);
};

test('remove incoming and outgoing connections', function(assert) {
  var store = this.container.lookup('store:main');

  var promises = setupConnection(store);
  var controller = this.subject();
  promises.then(function(values) {
    var operator = values.operator;
    var stream = values.stream;
    var inConnection = values.inConnection;
    var outConnection = values.outConnection;

    controller.set('model', operator);
    controller.removeConnections();

    Ember.run.schedule('destroy', this, function(){
      assert.equal(stream.get('connections.length'), 0,
                   'The connections of the operator are removed from the ' + 
                   'stream');
      assert.ok(inConnection.get('isSaving'),
                'The incoming connection is saved');
      assert.ok(outConnection.get('isSaving'),
                'The outgoing connection is saved');
    });
  });

  wait();
});

test('remove outgoing connection', function(assert) {
  var store = this.container.lookup('store:main');

  var promises = setupConnection(store, true); // no incoming connection
  var controller = this.subject();
  promises.then(function(values) {
    var operator = values.operator;
    var stream = values.stream;
    var inConnection = values.inConnection;
    var outConnection = values.outConnection;

    controller.set('model', operator);
    controller.removeConnections();

    Ember.run.schedule('destroy', this, function(){
      assert.equal(stream.get('connections.length'), 1,
                   'The outgoing connection is removed from the stream');
    });
  });

  wait();
});

test('remove incoming connection', function(assert) {
  var store = this.container.lookup('store:main');

  var promises = setupConnection(store, false, true); // no outgoing connection
  var controller = this.subject();
  promises.then(function(values) {
    var operator = values.operator;
    var stream = values.stream;
    var inConnection = values.inConnection;
    var outConnection = values.outConnection;

    controller.set('model', operator);
    controller.removeConnections();

    Ember.run.schedule('destroy', this, function(){
      assert.equal(stream.get('connections.length'), 1,
                   'The outgoing connection is removed from the stream');
    });
  });

  wait();
});
