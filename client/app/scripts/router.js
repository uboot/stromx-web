/* global App */

App.Router.map(function () {
  this.resource('files', { path: '/'}, function() {
    this.route('add');
    this.route('new');
  });
  this.resource('streams', function() {
    this.resource('stream', { path: '/:stream_id' });
  });
  this.resource('operators', function() {
    this.resource('operator', { path: '/:operator_id' });
  });
  this.resource('views', function() {
    this.resource('view', { path: '/:view_id' });
  });
});
