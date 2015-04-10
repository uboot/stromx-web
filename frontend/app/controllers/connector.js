import Ember from "ember";

export default Ember.Controller.extend({
  isEditingObserver: false,

  view: null,
  viewsExist: Ember.computed.gt('views.length', 0),
  views: Ember.computed.alias('model.operator.stream.views'),

  observerExists: function(key, value) {
    if (value !== undefined) {
      return value;
    }

    var _this = this;
    this.findObserver(this.get('view')).then( function(observer) {
      _this.set('observerExists', observer !== null);
    });
  }.property('view'),

  actions: {
    editObserver: function() {
      this.set('isEditingObserver', true);
    },
    discardChanges: function() {
      this.set('isEditingObserver', false);
    }
  }
});
