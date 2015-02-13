import Ember from "ember";

export default Ember.ObjectController.extend({
  points: function() {
    var pts = '';
    
    if (this.get('variant.ident') !== 'matrix') {
        return '';
    }
    
    if (this.get('value.cols') !== 2) {
        return '';
    }
    
    var values = this.get('value.values');
    var length = values.length;
    for (var i = 0; i < length; i++) {
        pts += values[i][0] + ',' + values[i][1] + ' ';
    }
    
    return pts;
  }.property()
});