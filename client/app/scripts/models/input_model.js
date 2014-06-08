/* global App */

App.Input = DS.Model.extend({
  title: DS.attr('string'),
  sourceOperator: DS.hasMany('operator', {async: true}),
  sourceId: DS.attr('number')
});

App.Input.FIXTURES = [
  {
    id: 1,
    title: 'Input image',
    sourceOperator: [],
    sourceId: -1
  },
  {
    id: 2,
    title: 'Number',
    sourceOperator: [0],
    sourceId: 0
  },
  {
    id: 3,
    title: 'Destination image',
    sourceOperator: [],
    sourceId: -1
  }
];