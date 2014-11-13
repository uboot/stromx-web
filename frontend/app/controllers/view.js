import Ember from "ember";

export default Ember.ObjectController.extend({
  isEditingName: false,

  actions: {
    saveName: function() {
      var model = this.get('model');
      model.save();
      this.set('isEditingName', false);
    },

    rename: function() {
      this.set('isEditingName', true);
    },

    remove: function () {
        var view = this.get('model');
        view.deleteRecord();
        view.save();
    }
  },

  parameterObservers: Ember.computed.alias('observers'),

  inputObservers: Ember.computed.filter('observers', function(observer) {
    return observer instanceof App.InputObserver;
  }),

  listSorting: ['zvalue:desc'],
  svgSorting: ['zvalue:incr'],

  listObservers: Ember.computed.sort('observers', 'listSorting'),
  svgObservers: Ember.computed.sort('observers', 'svgSorting'),
});
