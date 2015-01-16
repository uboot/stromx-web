import Ember from "ember";

var NO_THREAD = '#808080';

export default Ember.ObjectController.extend({
  isEditingThread: false,
  selectedThread: null,

  color: function(key, value) {
    if (value !== undefined) {
      return value;
    }

    var _this = this;
    this.get('thread').then(function(thread) {
      if (thread === null) {
        _this.set('color', NO_THREAD);
      }
      else {
        _this.set('color', thread.get('color'));
      }
    });
  }.property('thread.color'),

  threadName: function(key, value) {
    if (value !== undefined) {
      return value;
    }

    var _this = this;
    this.get('thread').then(function(thread) {
      if (thread === null) {
        _this.set('threadName', 'None');
      }
      else {
        _this.set('threadName', thread.get('name'));
      }
    });
  }.property('thread.name'),
  
  threads: function() {
    var threads = this.get('stream.threads').map( function(thread) {
      return {
        value: thread,
        name: thread.get('name'),
        color: thread.get('color'),
      };
    });
    threads.insertAt(0, {
      value: null,
      name: 'None',
      color: NO_THREAD
    });
    
    return threads;
  }.property('stream.threads'),

  actions: {
    editThread: function() {
      var _this = this;
      this.get('thread').then( function(thread) {
        _this.set('selectedThread', {
          value: thread,
          color: thread ? thread.get('color') : NO_THREAD
        });
        _this.set('isEditingThread', true);
      });
    },
    setThread: function(thread) {
      this.set('selectedThread', thread);
    },
    saveChanges: function() {
      this.set('isEditingThread', false);
      this.set('thread', this.get('selectedThread.value'));
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditingThread', false);
      this.get('model').rollback();
    },
  }
});

