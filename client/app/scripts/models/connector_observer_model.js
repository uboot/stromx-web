/* global App */

App.ConnectorObserver = DS.Model.extend({
  visualization: DS.attr('string'),
  color: DS.attr('string'),
  connector: DS.belongsTo('connector'),
  value: DS.belongsTo('connector-value', {async: true}),
  view: DS.belongsTo('view')
});

App.ConnectorObserver.FIXTURES = [
  {
    id: 0,
    visualization: 'lines',
    color: '#0000ff',
    connector: 4,
    value: 0,
    view: 1
  },
  {
    id: 2,
    visualization: 'image',
    color: '#0000ff',
    connector: 2,
    value: 1,
    view: 1
  }
];
