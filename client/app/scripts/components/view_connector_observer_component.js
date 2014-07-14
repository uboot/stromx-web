/* global App, Snap */

App.ViewConnectorObserverComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#view-svg');
    this.set('group', paper.group());

    this.updateContent();
    this.updatePosition();
  },

  updateContent: function() {
    var paper = new Snap('#view-svg');
    var group = this.get('group');
    var observer = this.get('connectorObserver');
    var visualization = observer.get('visualization')
    var items = null;
    var content = observer.get('valueContent');

    content.then( function(content) {
      ;
    });

    if (visualization === 'lines')
      items = this.paintLines(observer, paper);
    else if (visualization === 'image')
      items = this.paintImage(observer, paper);

    group.remove();
    group = paper.group()
    items.forEach( function(item) {
      group.add(item);
    })
  }.observes('connectorObserver.value'),

  paintLines: function(observer, paper) {
    var currentData = observer.get('currentData');
    var color = observer.get('color');
    var items = [];
    currentData.values.forEach( function(row) {
      var line = paper.line(row[0], row[1], row[2], row[3]);
      line.attr({
        stroke: color
      });
      items.push(line);
    });
    return items;
  },

  paintImage: function(observer, paper) {
    var currentData = observer.get('currentData');
    var image = currentData.image
    var width = currentData.width
    var height = currentData.height

    var image = paper.image(image, 0, 0, width, height);
    return [image];
  },

  updatePosition: function() {
    var group = this.get('group');
    var observer = this.get('connectorObserver');
    var pos = observer.get('position');
    group.attr({
      'z-value': pos
    })
  }.observes('connectorObserver.position')
});
