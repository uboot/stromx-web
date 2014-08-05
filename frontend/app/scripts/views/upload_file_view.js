/* global App */

// TODO: attribute to http://stackoverflow.com/a/19910677

App.UploadFileView = Ember.TextField.extend({
    tagName: 'input',
    type: 'file',
    content: null,
    change: function (e) {
        var reader = new FileReader(), 
        that = this;        
        reader.onload = function (e) {
            var fileToUpload = e.target.result;
            
            Ember.run(function() {
                that.set('content', fileToUpload);
            });            
        };
        return reader.readAsDataURL(e.target.files[0]);
    }
});