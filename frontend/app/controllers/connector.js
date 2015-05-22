import Ember from "ember";

export default Ember.Controller.extend({
  isEditingObserver: false,

  viewId: null,
  viewsExist: Ember.computed.gt('views.length', 0),
  views: Ember.computed.alias('model.operator.stream.views'),

  observerExists: function(key, value) {
    if (value !== undefined) {
      return value;
    }

    var view = this.get('view');
    var _this = this;
    this.findObserver(view).then( function(observer) {
      _this.set('observerExists', observer !== null);
    });
    
    return false;
  }.property('view'),
  
  view: function(key, value) {
    if (value !== undefined) {
      return value;
    }
    
    var _this = this;
    var viewId = this.get('viewId');
    if (viewId !== null) {
      this.store.find('view', this.get('viewId')).then(function(view) {
        _this.set('view', view);
      });
    }
    
    return null;
  }.property('viewId'),
  
  reloadView: function() {
    var view = this.get('view');
    view.reload().then(function(view) {
      view.get('observers').forEach(function(observer) {
        observer.reload();
      });
    });
  },

  actions: {
    editObserver: function() {
      this.set('isEditingObserver', true);
    },
    discardChanges: function() {
      this.set('isEditingObserver', false);
    }
  }
});
