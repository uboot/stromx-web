import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'td',
  isEditingObserver: false,
  isEditingDescription: false,

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
      var viewId = this.get('viewId');
      if (viewId === null) {
        return false;
      }

      return this.get('views').find(function(view) {
        return view.get('id') === viewId;
      });
    }
  }),

  actions: {
    editObserver: function() {
      this.set('viewId', null);
      this.set('isEditingObserver', true);
    },
    editDescription: function() {
      this.set('isEditingDescription', true);
    },
    discardChanges: function() {
      this.set('isEditingObserver', false);
      this.set('isEditingDescription', false);
    },
    addObserver: function() {
      var view = this.get('view');
      if (! view) {
        return;
      }
      this.sendAction('addObserver', view, this.get('model'));
    },
    showObserver: function() {
      var view = this.get('view');
      if (! view) {
        return;
      }
      var _this = this;
      this.findObserver(view).then( function(observer) {
        _this.sendAction('showObserver', observer);
      });
    },
    setTypeToParameter: function() {
      this.set('isEditingDescription', false);

      this.set('model.currentType', 'parameter');
      var model = this.get('model');
      var op = this.get('model.operator');
      model.save().catch(function() {
        model.rollbackAttributes();
      }).then(function() {
        op.then(function(op) {
          op.reload();
        });
      });
    }
  }
});
