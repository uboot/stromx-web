import Ember from "ember";

export default Ember.Controller.extend({
  points: function() {
    var pts = '';
    
    if (this.get('model.variant.ident') !== 'matrix') {
        return '';
    }
    
    if (this.get('model.value.cols') !== 2) {
        return '';
    }
    
    var values = this.get('model.value.values');
    var length = values.length;
    for (var i = 0; i < length; i++) {
        pts += values[i][0] + ',' + values[i][1] + ' ';
    }
    
    return pts;
  }.property()
});