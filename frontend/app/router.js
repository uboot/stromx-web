import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.resource('files', { path: '/'}, function() {
    this.route('add');
    this.route('new');
  });
  this.resource('streams', function() {
    this.resource('stream', { path: '/:stream_id' }, function() {
      this.route('newOperator');
      this.route('newThread');
      this.route('newView');
    });
  });
  this.resource('operators', function() {
    this.resource('operator', { path: '/:operator_id' });
  });
  this.resource('views', function() {
    this.resource('view', { path: '/:view_id' }, function() {
      this.route('newObserver');
    });
  });
});


export default Router;
