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

  title: function(key, value) {
    if (value !== undefined) {
      return value;
    }
    
    var _this = this;
    Ember.RSVP.all([
      this.get('input'),
      this.get('output')
    ]).then(function(connectors) {
      _this.set('title', connectors[0].get('title') + ' -> ' + connectors[1].get('title'));
    });
  }.property('input', 'output'),

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

