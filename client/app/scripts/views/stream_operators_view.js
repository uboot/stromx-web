/* global App */

App.StreamOperatorsView = Ember.CollectionView.extend({
  itemViewClass: Ember.View.extend({
    didInsertElement: function() {
      var paper = Snap('#svg');
      var name = this.content.get('name');
      var x = this.content.get('x');
      var y = this.content.get('y');
      paper.text(x, y, name);
      var opRect = paper.rect(x, y, 50, 50, 5, 5);
      opRect .attr({
        "fill-opacity": 0.0,
        stroke: "#000",
        strokeWidth: 2
      });
    }
  })
}); 
