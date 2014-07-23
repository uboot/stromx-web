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

      var items = null;
      if (visualization === 'lines')
        items = _this.paintLines(observer, paper, value);
      else if (visualization === 'image')
        items = _this.paintImage(observer, paper, value);

      var zvalue = _this.get('zvalue');
      var predecessor = Snap.select('g');
      var group = _this.get('group');
      group.remove();
      group = paper.group()
      items.forEach( function(item) {
        group.add(item);
      })
      _this.set('group', group);
    });
  }.observes('connectorObserver.value'),

  paintLines: function(observer, paper, value) {
    var matrix = value.get('value');
    var color = observer.get('color');
    var items = [];
    matrix.values.forEach( function(row) {
      var line = paper.line(row[0], row[1], row[2], row[3]);
      line.attr({
        stroke: color
      });
      items.push(line);
    });
    return items;
  },

  paintImage: function(observer, paper, value) {
    var image = value.get('value');
    var values = image.values
    var width = image.width
    var height = image.height

    var image = paper.image(values, 0, 0, width, height);
    return [image];
  }
});
