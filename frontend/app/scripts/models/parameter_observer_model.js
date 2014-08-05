/* global App */

require('scripts/models/observer_model');

App.ParameterObserver = App.Observer.extend({
  parameter: DS.belongsTo('parameter')
});

App.ParameterObserver.FIXTURES = [
  {
    id: 0,
    zvalue: 3,
    visualization: 'slider',
    color: '#000000',
    parameter: 3,
    view: 1
  }
];
