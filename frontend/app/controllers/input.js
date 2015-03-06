import Ember from "ember";

import ViewController from 'stromx-web/controllers/view';

export default Ember.Controller.extend({
  isEditingObserver: false,

  view: null,
  viewsExist: Ember.computed.gt('model.views.length', 0),
  views: Ember.computed.alias('model.operator.stream.views'),
  
  observerExists: function(key, value) {
    if (value !== undefined) {
      return value;
    }
    
    var _this = this;
    this.findObserver(this.get('model.view')).then( function(observer) {
      _this.set('observerExists', observer !== null);
    });
  }.property('view'),
  
  findObserver: function(view) {
    if (! view) {
      return Ember.RSVP.resolve(null);
    }
    
    var viewController = ViewController.create({
      model: view
    });
    
    var input = this.get('model');
    var inputObservers = viewController.get('inputObservers');
    return Ember.RSVP.all(inputObservers.map( function(observer) {
        return observer.get('input');
      })
    ).then( function(inputs) {
      var index = inputs.indexOf(input);
      return index !== -1 ? inputObservers[index] : null;
    });
  },

  actions: {
    editObserver: function() {
      this.set('isEditingObserver', true);
    },
    discardChanges: function() {
      this.set('isEditingObserver', false);
    },
    addObserver: function() {
      var view = this.get('model.view');
      if (! view) {
        return;
      }
      
      var viewController = ViewController.create({
        model: view,
        store: this.get('store')
      });
      
      var _this = this;
      var model = this.get('model');
      viewController.addInputObserver(model).then( function(observer) {
        _this.transitionToRoute('inputObserver.index', observer);
      });
    },
    showObserver: function() {
      var view = this.get('model.view');
      if (! view) {
        return;
      }
      
      var _this = this;
      this.findObserver(view).then( function(observer) {
        _this.transitionToRoute('inputObserver.index', observer);
      });
    }
  }
});
