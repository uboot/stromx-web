import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('waitForModal', function() {
  return new Ember.Test.promise(function(resolve) {
    Ember.Test.adapter.asyncStart();

    var promise = new Ember.RSVP.Promise(function(resolve) {
      if ($('.modal').length === 0) {
        resolve();
        return;
      }

      $('.modal').one('hidden.bs.modal', function() {
        resolve();
      });
    });

    promise.then(function() {
      Ember.run.schedule('afterRender', null, resolve);
      Ember.Test.adapter.asyncEnd();
    });
  });
});
