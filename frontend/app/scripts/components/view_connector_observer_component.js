/* global App, Snap */

App.ViewConnectorObserverComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#view-svg');
    var observer = this.get('connectorObserver');

    var group = paper.group();
    var zvalue = observer.get('zvalue');
    group.data('zvalue', zvalue);
    this.set('group', group);

    this.updateContent();
  },

  willDestroyElement: function() {
    var group = this.get('group');
    if (group)
      group.remove();
    this.set('group', null);
  },

  updateContent: function() {
    var observer = this.get('connectorObserver');
    var variant = this.get('variant');
    var value = this.get('value');
    if (!value)
      return;

    var _this = this;
    var paper = new Snap('#view-svg');
    var visualization = observer.get('visualization');

    var group = _this.get('group');
    if (! group)
      return;

    group.remove();

    group = paper.group();
    switch (visualization) {
      case 'lines':
        _this.paintLines(observer, group, value);
        break;
      case 'image':
        _this.paintImage(observer, group, value);
        break;
      case 'default':
        _this.paintDefault(observer, group, value);
        break;
      default:
        break;
    }
    _this.set('group', group);
    _this.updateZValue();
  }.observes('connectorObserver.color', 'value'),

  updateZValue: function() {
    var group = this.get('group');
    var observer = this.get('connectorObserver');
    var zvalue = observer.get('zvalue');
    group.data('zvalue', zvalue);

    var groups = Snap.selectAll('g');
    var groupAbove = null;
    var zvalueAbove = null;
    groups.forEach(function(group) {
      var groupZValue = group.data('zvalue');
      if (groupZValue > zvalue && (zvalueAbove === null || zvalueAbove > groupZValue))
      {
        groupAbove = group;
        zvalueAbove = groupZValue;
      }
    });

    if (groupAbove)
      group.insertBefore(groupAbove);
  }.observes('connectorObserver.zvalue'),

  paintDefault: function(observer, group, value) {
    var variant = this.get('variant');
    switch (variant) {
      case 'int':
      case 'float':
        this.paintNumber(observer, group, value);
        break;
      default:
        break;
    }
  },

  paintNumber: function(observer, group, value) {
    var color = observer.get('color');
    var text = group.text(50, 50, value);
    text.attr({
      stroke: color
    });
  },

  paintLines: function(observer, group, value) {
    var color = observer.get('color');
    var matrix = value;
    matrix.values.forEach( function(row) {
      var line = group.line(row[0], row[1], row[2], row[3]);
      line.attr({
        stroke: color
      });
    });
  },

  paintImage: function(observer, group, value) {
    var image = value;
    var values = image.values;
    var width = image.width;
    var height = image.height;

    group.image(values, 0, 0, width, height);
  }
});
