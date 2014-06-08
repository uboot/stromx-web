/* global App,  Snap */

App.StreamOperatorView = Ember.View.extend({
  group: null,
  
  didInsertElement: function() {
    var paper = new Snap('#svg');
    var group = paper.group();
    this.set('group', group);
    
    var x = this.content.get('x');
    var y = this.content.get('y');
    var translation = new Snap.Matrix();
    translation.translate(x, y);
    group.transform(translation);
    var name = this.content.get('name');
    var opName = paper.text(0, 60, name);
    var opRect = paper.rect(0, 0, 50, 50, 5, 5);
    opRect.attr({
      class: 'stromx-svg-operator',
      "fill-opacity": 0.0,
      stroke: "#000",
      strokeWidth: 2
    });
    group.add(opName, opRect);
    that = this;
    this.content.get('outputs').then(function(connectors) {
      that.createConnectors(group, connectors, 'output');
    });
    this.content.get('inputs').then(function(connectors) {
      that.createConnectors(group, connectors, 'input');
    });
  },
  
  willDestroyElement: function() {
    var opRect = this.get('opRect');
    if (opRect)
      opRect.remove();
    this.set('opRect', null);
  },
  
  createConnectors: function(group, connectors, type) {
    var x = -10
    if (type ==='output')
      x = 50;
    
    var num = connectors.get('length');
    var offset = 30 - 10 * num;
    var i = 0;
      
    connectors.map(function(connector) {
      var connectorRect = group.rect(x, offset + 20 * i, 10, 10);
      connectorRect.attr({
        class: 'stromx-svg-' + type
      });
      i++;
    });
  }
});