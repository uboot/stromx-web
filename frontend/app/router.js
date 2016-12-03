import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

const Router = Ember.Router.extend(googlePageview, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('files', { path: '/'}, function() {
    this.route('upload');
    this.route('new');
    this.route('file', {
      path: 'files/:file_id',
      resetNamespace: true
    }, function() {
      this.route('delete');
    });
  });
  this.route('streams', function() {
    this.route('stream', {
      path: '/:stream_id',
      resetNamespace: true
    }, function() {
      this.route('close');
      this.route('operators', { resetNamespace: true }, function() {
        this.route('operator', {
          path: '/:operator_id',
          resetNamespace: true
        }, function() {
          this.route('delete');
          this.route('parameters', { resetNamespace: true }, function() {
            this.route('parameter', {
              path: '/:parameter_id',
              resetNamespace: true
            }, function() {
              this.route('edit');
            });
          });
        });
        this.route('new');
      });
      this.route('views', { resetNamespace: true }, function() {
        this.route('view', {
          path: '/:view_id',
          resetNamespace: true
        }, function() {
          this.route('delete');
        });
        this.route('new');
      });
      this.route('connections', { resetNamespace: true }, function() {
        this.route('connection', {
          path: '/:connection_id',
          resetNamespace: true
        }, function() {
          this.route('delete');
        });
      });
      this.route('inputObservers', { resetNamespace: true }, function() {
        this.route('inputObserver', {
          path: '/:inputObserver_id',
          resetNamespace: true
        }, function() {
          this.route('delete');
        });
      });
      this.route('outputObservers', { resetNamespace: true }, function() {
        this.route('outputObserver', {
          path: '/:outputObserver_id',
          resetNamespace: true
        }, function() {
          this.route('delete');
        });
      });
      this.route('parameterObservers', { resetNamespace: true }, function() {
        this.route('parameterObserver', {
          path: '/:parameterObserver_id',
          resetNamespace: true
        }, function() {
          this.route('delete');
        });
      });
    });
  });
});


export default Router;
