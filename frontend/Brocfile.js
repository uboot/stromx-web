/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.
app.import('bower_components/bootstrap-sass/js/affix.js');
app.import('bower_components/bootstrap-sass/js/alert.js');
app.import('bower_components/bootstrap-sass/js/button.js');
app.import('bower_components/bootstrap-sass/js/carousel.js');
app.import('bower_components/bootstrap-sass/js/collapse.js');
app.import('bower_components/bootstrap-sass/js/dropdown.js');
app.import('bower_components/bootstrap-sass/js/modal.js');
app.import('bower_components/bootstrap-sass/js/tooltip.js');
app.import('bower_components/bootstrap-sass/js/popover.js');
app.import('bower_components/bootstrap-sass/js/scrollspy.js');
app.import('bower_components/bootstrap-sass/js/tab.js');
app.import('bower_components/bootstrap-sass/js/transition.js');

module.exports = app.toTree();
