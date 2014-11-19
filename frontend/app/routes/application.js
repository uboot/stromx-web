/*global $:false */

import Ember from "ember";
import ENV from '../config/environment';

export default Ember.Route.extend({
  socket: null,

  activate: function() {
    var host = 'ws://' + window.location.host;
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
      this.render(template, {
        into: 'application',
        outlet: 'modal',
        controller: controller
      });
      
      Ember.run.scheduleOnce('afterRender', this, function() {
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
    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },
    showContextMenu: function(template, x, y, controller) {
      this.render(template, {
        into: 'application',
        outlet: 'context',
        controller: controller
      });

      Ember.run.scheduleOnce('afterRender', this, function() {
        $('.context').show().css({
          position: "absolute",
          left: x,
          top: y
        });
        $('body').click(function () {
          $('.context').hide();
        });
      });
    }
  }
});
