/*global $:false */

import Ember from "ember";
import ENV from '../config/environment';

export default Ember.Route.extend({
  socket: null,

  activate: function() {
    var protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    var host = protocol + '//' + window.location.host;
    if (ENV.APP.SOCKET_HOST) {
      host = ENV.APP.SOCKET_HOST;
    }
    var url = host + '/socket/error';
    
    var ws = new WebSocket(url);
    var _this = this;
    ws.onmessage = function(event) {
      var payload = JSON.parse(event.data);
      _this.store.pushPayload('error', payload);
      Ember.run.next(function() {
        _this.store.find('error', payload.error.id).then(function(error) {
          _this.controller.pushObject(error);
        });
      });
    };
    this.set('socket', ws);
  },

  deactivate: function() {
    var ws = this.get('socket');
    ws.close();
  },

  actions: {
    showModal: function(template, model) {
      var controller = this.controllerFor(template);
      var _this = this;
      controller.set('model', model);
      
      // add the controller to the DOM
      this.render(template, {
        into: 'application',
        outlet: 'modal',
        controller: controller
      });
      
      // after has been added to the DOM...
      Ember.run.scheduleOnce('afterRender', this, function() {
        // ...show it
        $('.modal').modal('show');
        
        // remove it from the DOM after it has been hidden again
        $('.modal').one('hidden.bs.modal', function() {
          Ember.run(function() {
            _this.disconnectOutlet({
              outlet: 'modal',
              parentView: 'application'
            });
          });
        });
      });
    },
    
    showContextMenu: function(template, x, y, controller) {
      // add the menu to the DOM
      this.render(template, {
        into: 'application',
        outlet: 'context',
        controller: controller
      });
      
      // after has been added to the DOM...
      Ember.run.scheduleOnce('afterRender', this, function() {
        // ...show it at the mouse position
        $('.context').show().css({
          position: "absolute",
          left: x,
          top: y
        });
        
        // hide it at the first mouse click
        $('body').click(function () {
          $('.context').hide();
        });
      });
    }
  }
});
