import Ember from "ember";

import ViewController from 'stromx-web/controllers/view';
import { DEFAULT_OBSERVER_COLOR } from 'stromx-web/colors';

export default Ember.Controller.extend({
  isEditingName: false,
  isDeinitialized: Ember.computed.equal('model.status', 'none'),
  hasInputs: Ember.computed.gt('model.inputs.length', 0),
  hasOutputs: Ember.computed.gt('model.outputs.length', 0),
  hasParameters: Ember.computed.gt('model.parameters.length', 0),

  fullType: function() {
    return this.get('model.package') + '::' + this.get('model.type');
  }.property('model.type', 'model.package'),

  statusLabel: function() {
    var status = this.get('model.status');

    switch (status) {
      case 'none':
        return 'Not initialized';
      case 'initialized':
        return 'Initialized';
      default:
        return 'Not defined';
    }
  }.property('model.status'),

   removeObservers: function() {
    var store = this.get('store');
    var removeInputObservers = this.get('model.inputs').then(function(inputs) {
      var observerLists = inputs.map( function(input) {
        return input.get('observers');
      });

      return Ember.RSVP.all(observerLists);
    }).then(function(observerLists) {
      var promises = [];
      observerLists.forEach( function(observers) {
        observers.forEach( function(observer) {
          var view = observer.get('view');
          var viewController = ViewController.create({
            model: view,
            store: store
          });
          promises.pushObject(viewController.removeObserver(observer));
        });
      });

      return Ember.RSVP.all(promises);
    });

    var removeOutputObservers = this.get('model.outputs').then(function(outputs) {
      var observerLists = outputs.map( function(input) {
        return input.get('observers');
      });

      return Ember.RSVP.all(observerLists);
    }).then(function(observerLists) {
      var promises = [];
      observerLists.forEach( function(observers) {
        observers.forEach( function(observer) {
          var view = observer.get('view');
          var viewController = ViewController.create({
            model: view,
            store: store
          });
          promises.pushObject(viewController.removeObserver(observer));
        });
      });

      return Ember.RSVP.all(promises);
    });

    return Ember.RSVP.all([removeInputObservers, removeOutputObservers]);
  },

  removeConnections: function() {
    var removeIncoming = this.get('model.inputs').then(function(inputs) {
      var connections = inputs.map( function(input) {
        return input.get('connection');
      });
      return Ember.RSVP.all(connections);
    }).then(function(connections) {
      var removed = connections.map( function(connection) {
        if (connection) {
          connection.deleteRecord();
          return connection.save();
        }
      });

      return Ember.RSVP.all(removed);
    });

    var removeOutgoing = this.get('model.outputs').then(function(outputs) {
      var connectionLists = outputs.map(function(output) {
        return output.get('connections');
      });
      return Ember.RSVP.all(connectionLists);
    }).then(function(connectionLists) {
      var promises = [];
      connectionLists.forEach(function(connections) {
        // convert to an array below because the 'connections' becomes invalid
        // if elements are removed from it
        connections.toArray().forEach(function(connection) {
          if (connection) {
            connection.deleteRecord();
            promises.pushObject(connection.save());
          }
        });
      });
      return Ember.RSVP.all(promises);
    });

    return Ember.RSVP.all([removeIncoming, removeOutgoing]);
  },

  removeDependencies: function() {
    return Ember.RSVP.all([
      this.removeConnections(),
      this.removeObservers()
    ]);
  },

  reloadConnectionsAndObservers: function() {
    var model = this.get('model');
    model.get('stream').then(function(stream) {
      if (! stream) {
        return;
      }


      stream.get('views').then(function(views) {
        var reloadedViews = views.map(function(view) {
          return view.reload();
        });
        Ember.RSVP.all(reloadedViews).then(function(views) {
          views.forEach(function(view) {
            view.get('observers').then(function(observers) {
              observers.forEach(function(observer) {
                observer.reload();
              });
            });
          });
        });
      });

      return stream.reload();
    });
  },

  reloadView: function(view) {
    view.reload().then(function(view) {
      view.get('observers').forEach(function(observer) {
        observer.reload();
      });
    });
  },

  actions: {
    editName: function() {
      this.set('isEditingName', true);
    },
    saveChanges: function() {
      this.set('isEditingName', false);
      this.get('model').save();
    },
    discardChanges: function() {
      this.set('isEditingName', false);
      this.get('model').rollbackAttributes();
    },
    initialize: function() {
      var model = this.get('model');
      model.set('status', 'initialized');
      model.save().catch(function() {
        model.rollbackAttributes();
      });
    },
    deinitialize: function() {
      this.set('model.status', 'none');
      var model = this.get('model');
      var _this = this;
      model.save().then(function() {
        _this.reloadConnectionsAndObservers();
      }).catch(function() {
        model.rollbackAttributes();
      });
    },
    addInputObserver: function(view, input) {
      var numObservers = view.get('observers.length');
      var observer = this.store.createRecord('input-observer', {
        view: view,
        input: input,
        zvalue: numObservers + 1,
        properties: {
          color: DEFAULT_OBSERVER_COLOR
        },
        visualization: ''
      });

      var _this = this;
      observer.save().then(function(observer) {
        _this.reloadView(view);
        _this.transitionToRoute('inputObserver.index', observer);
      });
    },
    showInputObserver: function(observer) {
      this.transitionToRoute('inputObserver.index', observer);
    },
    addOutputObserver: function(view, output) {
      var numObservers = view.get('observers.length');
      var observer = this.store.createRecord('output-observer', {
        view: view,
        output: output,
        zvalue: numObservers + 1,
        properties: {
          color: DEFAULT_OBSERVER_COLOR
        },
        visualization: ''
      });

      var _this = this;
      observer.save().then(function(observer) {
        _this.reloadView(view);
        _this.transitionToRoute('outputObserver.index', observer);
      });
    },
    showOutputObserver: function(observer) {
      this.transitionToRoute('outputObserver.index', observer);
    }
  }
});
