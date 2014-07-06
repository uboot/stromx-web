/* global App */

App.Observer = DS.Model.extend({
  visualizationType: DS.attr('string'),
  dataType: DS.attr('string'),
  data: DS.attr('string'),
  color: DS.attr('string'),
  connector: DS.belongsTo('Connector')
});

App.Observer.FIXTURES = [
  {
    id: 0,
    visualizationType: 'lines',
    dataType: 'matrix',
    data: '',
    color: '#0000ff',
    connector: 4,
    rows: 3,
    cols: 4
  }
];
