App.UploadFile = Ember.TextField.extend({
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