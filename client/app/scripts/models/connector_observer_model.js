/* global App */

require('scripts/models/observer_model');

App.ConnectorObserver = App.Observer.extend({
  connector: DS.belongsTo('connector'),
  value: DS.belongsTo('connector-value', {async: true}),
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
    zvalue: 2,
    visualization: 'image',
    color: '#0000ff',
    connector: 2,
    value: 1,
    view: 1
  }
];
