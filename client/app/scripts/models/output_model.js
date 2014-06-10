/* global App */

App.Output = DS.Model.extend({
  title: DS.attr('string'),
  operator: DS.belongsTo('operator'),
  position: DS.attr('number')
});

App.Output.FIXTURES = [
  {
    id: 1,
    title: 'Output image',
    operator: 2,
    position: 0
  },
  {
    id: 2,
    title: 'Generated number',
    operator: 0,
    position: 0
  },
  {
    id: 3,
    title: 'Received image',
    operator: 3,
    position: 0
  }
];