/* global App */

App.Connection = DS.Model.extend({
  sourceOperator: DS.belongsTo('operator'),
  sourcePosition: DS.attr('number'),
  targetOperator: DS.belongsTo('operator'),
  targetPosition: DS.attr('number'),
  thread: DS.hasMany('thread', {async: true})
});

App.Connection.FIXTURES = [
  {
    id: 1,
    sourceOperator: 0,
    sourcePosition: 0,
    targetOperator: 1,
    targetPosition: 0,
    thread: [1]
  },
  {
    id: 2,
    sourceOperator: 0,
    sourcePosition: 0,
    targetOperator: 2,
    targetPosition: 1,
    thread: []
  }
];
