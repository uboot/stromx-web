/* global App */

App.Input = DS.Model.extend({
  title: DS.attr('string'),
  operator: DS.belongsTo('operator', {async: true}),
  connection: DS.belongsTo('connection', {async: true}),
  observers: DS.hasMany('input-observer', {async: true})
});

App.Input.FIXTURES = [
  {
    id: 1,
    title: 'Input image',
    operator: 2,
    connection: null,
    observers: [0]
  },
  {
    id: 2,
    title: 'Number',
    operator: 1,
    connection: 1,
    observers: [2, 3]
  },
  {
    id: 3,
    title: 'Destination image',
    operator: 2,
    connection: 2,
    observers: []
  }
];
