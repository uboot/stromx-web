/* global App,  Snap */

App.SceneOperatorView = Ember.View.extend({
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
    var opName = paper.text(0, 65, name);
    var opRect = paper.rect(0, 0, 50, 50, 5, 5);
    opRect.attr({
      class: 'stromx-svg-operator',
      "fill-opacity": 0.0,
      stroke: "#000",
      strokeWidth: 2
    });
    group.add(opName, opRect);
    var that = this;
    this.content.get('outputs').then(function(connectors) {
      that.createOutputs(group, connectors);
    });
    this.content.get('inputs').then(function(connectors) {
      that.createInputs(group, connectors);
    });
  },
  
  willDestroyElement: function() {
    var group = this.get('group');
    if (group)
      group.remove();
    this.set('group', null);
  },
  
  createInputs: function(group, connectors) {
    var numInputs = connectors.get('length');
    var offset = 30 - 10 * numInputs;
    var i = 0;
      
    connectors.map(function(connector) {
      var connectorRect = group.rect(-10, offset + 20 * i, 10, 10);
      connectorRect.attr({
        class: 'stromx-svg-input'
      });
      
      var inputPos = {
        x: -5,
        y: offset + 20 * i + 5
      };
      var sourceId = connector.get('sourceId');
      connector.get('sourceOperator').then(function(operator){
        operator.map(function(operator){
          operator.get('outputs').then(function(outputs){
            var numOutputs = outputs.get('length');
            var offset = 30 - 10 * numOutputs;
            var outputPos = {
              x: 55,
              y: offset + 20 * sourceId + 5
            };
            var transform = new Snap.Matrix();
            transform.translate(operator.get('x'), operator.get('y'));
            var targetTransform = group.transform().globalMatrix;
            transform.add(targetTransform.invert());
            var localOutputPos = {
              x: transform.x(outputPos.x, outputPos.y),
              y: transform.y(outputPos.x, outputPos.y)
            };
            var line = group.line(inputPos.x, inputPos.y,
                                  localOutputPos.x, localOutputPos.y);
            line.attr({
              strokeWidth: 2,
              stroke: "#000"
            });
          });
        });
      });
      
      i++;
    });
  },
  
  createOutputs: function(group, connectors) {
    var num = connectors.get('length');
    var offset = 30 - 10 * num;
    var i = 0;
      
    connectors.map(function(connector) {
      var connectorRect = group.rect(50, offset + 20 * i, 10, 10);
      connectorRect.attr({
        class: 'stromx-svg-output'
      });
      i++;
    });
  }
});