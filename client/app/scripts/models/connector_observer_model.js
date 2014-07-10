/* global App */

App.ConnectorObserver = DS.Model.extend({
  visualization: DS.attr('string'),
  color: DS.attr('string'),
  dataType: DS.attr('string'),
  currentData: DS.attr(),
  connector: DS.belongsTo('connector')
});

App.ConnectorObserver.FIXTURES = [
  {
    id: 0,
    visualization: 'lines',
    color: '#0000ff',
    dataType: 'matrix',
    currentData: {
      rows: 3,
      cols: 4,
      values: [
        [1, 1, 2, 2],
        [1, 2, 2, 3],
        [1, 3, 2, 4]
      ]
    },
    connector: 4
  }
];
