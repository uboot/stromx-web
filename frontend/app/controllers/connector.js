import Ember from "ember";

export default Ember.Controller.extend({
  isEditingObserver: false,

  viewId: null,
  viewsExist: Ember.computed.gt('views.length', 0),
  views: Ember.computed.alias('model.operator.stream.views'),

  observerExists: Ember.computed('view', {
    set: function (key, value) {
      return value;
    },
    get: function() {
      var view = this.get('view');
      var _this = this;
      this.findObserver(view).then( function(observer) {
        _this.set('observerExists', observer !== null);
      });
      
      return false;
    }
  }),
  
  view: Ember.computed('viewId',  {
    set: function(key, value) {
      return value;
    },
    get: function() {
      var _this = this;
      var viewId = this.get('viewId');
      if (viewId !== null) {
        this.store.findRecord('view', this.get('viewId')).then(function(view) {
          _this.set('view', view);
        });
      }
      
      return null;
    }
  }),
  
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
