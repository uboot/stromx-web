/* global App */

App.ParameterObserver = DS.Model.extend({
  visualization: DS.attr('string'),
  color: DS.attr('string'),
  parameter: DS.belongsTo('parameter')
});

App.ParameterObserver.FIXTURES = [
  {
    id: 0,
    visualization: 'slider',
    color: '#0000ff',
    parameter: 3
  }
];
