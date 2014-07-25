/* global App, Snap */

App.ViewConnectorObserverComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#view-svg');
    this.set('group', paper.group());

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

      var zvalueAbove = observer.get('zvalue') + 1;
      var groupAbove = Snap.select('g:nth-of-type(' + zvalueAbove + ')');

      var group = _this.get('group');
      group.remove();

      group = paper.group();
      if (groupAbove)
        groupAbove.before(group);
      if (visualization === 'lines')
        _this.paintLines(observer, group, value);
      else if (visualization === 'image')
        _this.paintImage(observer, group, value);
      _this.set('group', group);
    });
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
