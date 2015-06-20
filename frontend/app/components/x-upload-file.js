import Ember from "ember";

export default Ember.TextField.extend({
  tagName: 'input',
  type: 'file',
  attributeBindings: ['multiple'],
  multiple: false,
  content: null,
  
  change: function(e) {
    var reader = new FileReader(), 
    _this = this;        
    reader.onload = function (e) {
      var fileContent = e.target.result;
        
      Ember.run(function() {
        _this.set('content', fileContent);
      });            
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});