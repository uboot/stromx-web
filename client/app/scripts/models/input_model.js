/* global App */

App.Input = DS.Model.extend({
  title: DS.attr('string'),
  operator: DS.belongsTo('operator'),
  position: DS.attr('number'),
  sourceOperator: DS.hasMany('operator', {async: true}),
  sourcePosition: DS.attr('number'),
  thread: DS.hasMany('thread', {async: true})
});

App.Input.FIXTURES = [
  {
    id: 1,
    title: 'Input image',
    operator: 2,
    position: 0,
    sourceOperator: [],
    sourcePosition: -1,
    thread: []
  },
  {
    id: 2,
    title: 'Number',
    operator: 1,
    position: 0,
    sourceOperator: [0],
    sourcePosition: 0,
    thread: [1]
  },
  {
    id: 3,
    title: 'Destination image',
    operator: 2,
    position: 1,
    sourceOperator: [],
    sourcePosition: -1,
    thread: []
  }
];