/* global App */

App.Output = DS.Model.extend({
  title: DS.attr('string'),
  operator: DS.belongsTo('operator', {async: true}),
  connections: DS.hasMany('connection', {async: true})
});

App.Output.FIXTURES = [
  {
    id: 4,
    title: 'Output image',
    operator: 2,
    connections: []
  },
  {
    id: 5,
    title: 'Generated number',
    operator: 0,
    connections: [1, 2]
  },
  {
    id: 6,
    title: 'Received image',
    operator: 3,
    connections: []
  }
];
