import Ember from "ember";

export default Ember.Component.extend({
  zoom: 1.0,
  activeOutput: null,
  activeInput: null,
  isDraggingInputToOutput: false,
  isDraggingOutputToInput: false,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  
  width: function() {
    return 1280 * this.get('zoom');
  }.property('zoom'),
  height: function() {
    return 1024 * this.get('zoom');
  }.property('zoom'),
  patternUri: function() {
    return 'url(' + this.get('targetObject.target.url') + '#grid)';
  }.property('targetObject.target.url'),
  
  strokeWidth: function() {
    return this.get('isDraggingValidConnection') ? 4 : 2;
  }.property('isDraggingValidConnection'),
  
  isDraggingConnection: Ember.computed.or('isDraggingInputToOutput', 'isDraggingOutputToInput'),
  
  isDraggingValidConnection: function() {
    var activeInput = this.get('activeInput') !== null;
    var activeOutput = this.get('activeOutput') !== null;
    console.log(activeInput, activeOutput);
    return activeInput && activeOutput;
  }.property('activeInput', 'activeOutput'),

  addConnection: function(input, output) {
    var model = this.get('model');
    var store = this.get('targetObject').store;
    var connection = store.createRecord('connection', {
      output: output,
      input: input,
      stream: model
    });

    var targetObject = this.get('targetObject');
    connection.save().then(function(connection) {
      targetObject.transitionToRoute('connection', connection);
    });
  },

  actions: {
    magnify: function() {
      var newZoom = Math.min(8.0, this.get('zoom') * Math.sqrt(2.0));
      this.set('zoom', newZoom);
    },
    minify: function() {
      var newZoom = Math.max(0.125, this.get('zoom') / Math.sqrt(2.0));
      this.set('zoom', newZoom);
    },
    reset: function() {
      this.set('zoom', 1.0);
    },
    inputDragStart: function(input, x, y) {
      var _this = this;
      input.get('connection').then(function(connection) {
        if (connection !== null) {
          return;
        }
        
        _this.setProperties({
          activeInput: input,
          x1: x,
          y1: y,
          x2: x,
          y2: y,
          isDraggingInputToOutput: true
        });
      });
    },
    inputDragMove: function(input, x, y) {
      this.setProperties({
        x2: x,
        y2: y
      });
    },
    inputDragEnd: function() {
      if (this.get('isDraggingValidConnection')) {
        this.addConnection(this.get('activeInput'), this.get('activeOutput'));
      }
      
      this.setProperties({
        activeInput: null,
        activeOutput: null,
        isDraggingInputToOutput: false
      });
    },
    inputEnter: function(input) {
      if (this.get('isDraggingOutputToInput')) {
        this.set('activeInput', input);
      }
    },
    inputLeave: function() {
      if (this.get('isDraggingOutputToInput')) {
        this.set('activeInput', null);
      }
    },
    outputDragStart: function(output, x, y) {
      this.setProperties({
        activeOutput: output,
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        isDraggingOutputToInput: true
      });
    },
    outputDragMove: function(output, x, y) {
      this.setProperties({
        x2: x,
        y2: y
      });
    },
    outputDragEnd: function() {
      if (this.get('isDraggingValidConnection')) {
        this.addConnection(this.get('activeInput'), this.get('activeOutput'));
      }
      
      this.setProperties({
        activeInput: null,
        activeOutput: null,
        isDraggingOutputToInput: false
      });
    },
    outputEnter: function(output) {
      if (this.get('isDraggingInputToOutput')) {
        this.set('activeOutput', output);
      }
    },
    outputLeave: function() {
      if (this.get('isDraggingInputToOutput')) {
        this.set('activeOutput', null);
      }
    }
  }
});
