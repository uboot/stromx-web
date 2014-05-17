emq.globalize();
App.setupForTesting();
App.injectTestHelpers();
setResolver(Ember.DefaultResolver.create({ namespace: App }));

moduleFor('controller:file', 'File Controller');

test('calling the action close updates closed', function() {
  
  // get the controller instance
  var ctrl = this.subject();
  
  ctrl.set('content', {
    'opened': true ,
    'save': function() {}
  })

  // check the properties before the action is triggered
  equal(ctrl.get('closed'), false);

  // trigger the action on the controller by using the `send` method, 
  // passing in any params that our action may be expecting
  ctrl.send('close');

  // finally we assert that our values have been updated 
  // by triggering our action.
  equal(ctrl.get('closed'), true);
});