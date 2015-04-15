import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

var Router = Ember.Router.extend(googlePageview, {
  location: config.locationType
});

Router.map(function () {
  this.resource('files', { path: '/'}, function() {
    this.route('upload');
    this.route('new');
    this.resource('file', { path: 'files/:file_id' }, function() {
      this.route('delete');
    });
  });
  this.resource('streams', function() {
    this.resource('stream', { path: '/:stream_id' }, function() {
      this.route('close');
      this.resource('operators', function() {
        this.resource('operator', { path: '/:operator_id' }, function() {
          this.route('delete');
          this.resource('parameters', function() {
            this.resource('parameter', { path: '/:parameter_id' }, function() {
              this.route('edit');
            });
          });
        });
        this.route('new');
      });
      this.resource('views', function() {
        this.resource('view', { path: '/:view_id' }, function() {
          this.route('delete');
        });
        this.route('new');
      });
      this.resource('connections', function() {
        this.resource('connection', { path: '/:connection_id' }, function() {
          this.route('delete');
        });
      });
      this.resource('inputObservers', function() {
        this.resource('inputObserver', { path: '/:inputObserver_id' }, function() {
          this.route('delete');
        });
      });
      this.resource('outputObservers', function() {
        this.resource('outputObserver', { path: '/:outputObserver_id' }, function() {
          this.route('delete');
        });
      });
      this.resource('parameterObservers', function() {
        this.resource('parameterObserver', { path: '/:parameterObserver_id' }, function() {
          this.route('delete');
        });
      });
    });
  });
});


export default Router;
