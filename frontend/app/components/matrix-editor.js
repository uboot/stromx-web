import Ember from "ember";

export default Ember.Component.extend({
  rows: 0,
  cols: 0,
  value: {
    rows: 0,
    cols: 0,
    values: [[]]
  },
  
  rowsWritable: Ember.computed.equal('rows', 0),
  colsWritable: Ember.computed.equal('cols', 0),
  
  actualRows: function(key, rows) {
    // setter
    if (arguments.length > 1) {
      var oldRows = this.get('value.rows');
      var oldValues = this.get('value.values').copy();
      var values = [[]];
      
      if (rows < oldRows) {
        values = oldValues.slice(0, rows);
      } else {
        values = oldValues.copy();
        var cols = this.get('value.cols');
        for (var i = 0; i < rows - oldRows; i++) {
          var row = [];
          for (var j = 0; j < cols; j++) {
            row.push(0);
          }
          values.push(row);
        }
      }
      
      this.set('value.rows', rows);
      this.set('value.values', values);
    }

    // getter
    return this.get('value.rows');
  }.property('value.rows'),
  
  actualCols: function(key, cols) {
    // setter
    if (arguments.length > 1) {
      var oldCols = this.get('value.cols');
      var oldValues = this.get('value.values').copy();
      
      var values = [];
      var i = 0;
      if (cols < oldCols) {
        for (i = 0; i < oldValues.length; i++) {
          values.push(oldValues[i].slice(0, cols));
        }
      } else {
        for (i = 0; i < oldValues.length; i++) {
          var newRow = oldValues[i].copy();
          for (var j = 0; j < cols - oldCols; j++) {
            newRow.push(0);
          }
          values.push(newRow);
        }
      }
      
      this.set('value.cols', cols);
      this.set('value.values', values);
    }

    // getter
    return this.get('value.cols');
  }.property('value.cols'),
  
  actions: {
    storeValue: function(row, col, value) {
      this.get('value').values[row][col] = value;
    }
  }
});
