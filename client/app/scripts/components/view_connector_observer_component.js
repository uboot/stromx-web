/* global App, Snap */

App.ViewConnectorObserverComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#view-svg');
    var observer = this.get('connectorObserver');

    var group = paper.group();
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
    var value = observer.get('value');
    var _this = this;

    value.then( function(value) {
      var paper = new Snap('#view-svg');
      var visualization = observer.get('visualization')

      var group = _this.get('group');
      group.remove();

      group = paper.group();
      if (visualization === 'lines')
        _this.paintLines(observer, group, value);
      else if (visualization === 'image')
        _this.paintImage(observer, group, value);
      _this.set('group', group);
      _this.updateZValue();
    });
  }.observes('connectorObserver.value'),

  updateZValue: function() {
    var group = this.get('group');
    var observer = this.get('connectorObserver');
    var zvalue = observer.get('zvalue')
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

  paintLines: function(observer, group, value) {
    var matrix = value.get('value');
    var color = observer.get('color');
    matrix.values.forEach( function(row) {
      var line = group.line(row[0], row[1], row[2], row[3]);
      line.attr({
        stroke: color
      });
    });
  },

  paintImage: function(observer, group, value) {
    var image = value.get('value');
    var values = image.values
    var width = image.width
    var height = image.height

    var image = group.image(values, 0, 0, width, height);
  }
});
