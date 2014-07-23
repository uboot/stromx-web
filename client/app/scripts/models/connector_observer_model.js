/* global App */

App.ConnectorObserver = DS.Model.extend({
  zvalue: DS.attr('number'),
  visualization: DS.attr('string'),
  color: DS.attr('string'),
  connector: DS.belongsTo('connector'),
  value: DS.belongsTo('connector-value', {async: true}),
  view: DS.belongsTo('view')
});

App.ConnectorObserver.FIXTURES = [
  {
    id: 0,
    zvalue: 1,
    visualization: 'lines',
    color: '#0000ff',
    connector: 5,
    value: 0,
    view: 1
  },
  {
    id: 2,
    zvalue: 0,
    visualization: 'image',
    color: '#0000ff',
    connector: 2,
    value: 1,
    view: 1
  }
];
