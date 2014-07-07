/* global App */

App.Observer = DS.Model.extend({
  visualization: DS.attr('string'),
  dataType: DS.attr('string'),
  data: DS.attr('string'),
  color: DS.attr('string'),
  connector: DS.belongsTo('Connector')
});

App.Observer.FIXTURES = [
  {
    id: 0,
    visualization: 'lines',
    dataType: 'matrix',
    data: {
      rows: 3,
      cols: 4,
      values: [
        [1, 1, 2, 2],
        [1, 2, 2, 3],
        [1, 3, 2, 4]
      ]
    },
    color: '#0000ff',
    connector: 4
  }
];
