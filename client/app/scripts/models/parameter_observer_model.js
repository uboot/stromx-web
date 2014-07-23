/* global App */

App.ParameterObserver = DS.Model.extend({
  zvalue: DS.attr('number'),
  visualization: DS.attr('string'),
  color: DS.attr('string'),
  parameter: DS.belongsTo('parameter'),
  view: DS.belongsTo('view')
});

App.ParameterObserver.FIXTURES = [
  {
    id: 0,
    zvalue: 0,
    visualization: 'slider',
    color: '#0000ff',
    parameter: 3,
    view: 1
  }
];
