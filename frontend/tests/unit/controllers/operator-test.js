import Ember from 'ember';
import startApp from '../../helpers/start-app';
import {
  test
} from 'ember-qunit';
import { moduleForController, createRecord } from '../../helpers/stromx-web-helpers';

var App;

moduleForController('operator', 'OperatorController', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  },
  needs: ['model:operator', 'model:parameter', 'model:input', 'model:output',
  'model:connection', 'model:stream', 'model:enum-description',
  'model:input-observer', 'model:file', 'model:view', 'model:thread',
  'model:connector-value', 'model:observer']
});

test('initialize', function() {
  var store = this.store();
  var operator = createRecord(store, 'operator', {
    status: 'none'
  });

  var controller = this.subject();
  Ember.run(function() {
    return operator.save();
  }).then(function(operator) {
    controller.set('model', operator);
    controller.send('initialize');
    equal(controller.get('model.status'), 'initialized',
      "Initializing a controller sets the status of its model to 'initialized'");
    ok(operator.get('isSaving'), 'Deinitializing an operator saves its model');
  });

  wait();
});

test('deinitialize', function() {
  var store = this.store();
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
      equal(operator.get('status'), 'none',
        "Deinitializing an operator sets the status of its model to 'none'");
      ok(operator.get('isSaving'), 'Deinitializing an operator saves its model');
    });
  });

  wait();
});

var setupConnection = function(store) {
  var stream = createRecord(store, 'stream');
  var operator = createRecord(store, 'operator');
  var sourceOutput = createRecord(store, 'output');
  var targetInput = createRecord(store, 'input');
  var output = createRecord(store, 'output', { operator: operator });
  var input = createRecord(store, 'input', { operator: operator });
  var inConnection = createRecord(store, 'connection', {
    stream: stream,
    input: input,
    output: sourceOutput
  });
  var outConnection = createRecord(store, 'connection', {
    stream: stream,
    input: targetInput,
    output: output
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

test('deinitialize and remove connection', function() {
  var store = this.store();

  var promises = setupConnection(store);
  var controller = this.subject();
  promises.then(function(values) {
    var operator = values.operator;
    var stream = values.stream;
    var inConnection = values.inConnection;
    var outConnection = values.outConnection;

    controller.set('model', operator);
    controller.send('deinitialize');

    Ember.run.schedule('destroy', this, function(){
      equal(stream.get('connections.length'), 0,
        'Deinitializing an operator removes its connections from the stream');
      ok(inConnection.get('isSaving'),
        'Deinitializing an operator saves the removed incoming connection');
      ok(outConnection.get('isSaving'),
        'Deinitializing an operator saves the removed outgoing connection');
    });
  });

  wait();
});
