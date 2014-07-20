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
    var paper = new Snap('#view-svg');
    var group = this.get('group');
    var observer = this.get('connectorObserver');
    var visualization = observer.get('visualization')
    var items = null;
    var value = observer.get('value');
    var _this = this;

    value.then( function(value) {
      if (visualization === 'lines')
        items = _this.paintLines(observer, paper, value);
      else if (visualization === 'image')
        items = _this.paintImage(observer, paper, value);

      group.remove();
      group = paper.group()
      items.forEach( function(item) {
        group.add(item);
      })
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
