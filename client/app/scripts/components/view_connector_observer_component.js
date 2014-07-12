/* global App, Snap */

App.ViewConnectorObserverComponent = Ember.Component.extend({
  group: null,

  didInsertElement: function() {
    var paper = new Snap('#view-svg');
    this.set('group', paper.group());

    this.updateContent();
  },

  updateContent: function() {
    var paper = new Snap('#view-svg');
    var group = this.get('group');
    var observer = this.get('connectorObserver');
    var visualization = observer.get('visualization')
    var items = null;

    if (visualization === 'lines')
      items = this.paintLines(observer, paper);
    else if (visualization === 'image')
      items = this.paintImage(observer, paper);

    group.remove();
    group = paper.group()
    items.forEach( function(item) {
      group.add(item);
    })

    this.updatePosition();
  }.observes('connectorObserver'),

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
    var pos = this.get('position');
    group.attr({
      'z-value': pos
    });
  },

  position: function() {
    var observer = this.get('connectorObserver');
    var view = observer.get('view');
    var observers = view.get('connectorObservers');
    var observerModel = observer.get('model');

    return observers.indexOf(observerModel);
  }.property('connectorObserver.view.connectorObservers')
});
