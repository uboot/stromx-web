/* global App */

App.Thread = DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('string'),
  stream: DS.belongsTo('stream', {async: true}),
  connections: DS.hasMany('connection', {async: true})
});

App.Thread.FIXTURES = [
  {
    id: 1,
    name: 'Thread',
    color: '#be202e',
    stream: 2,
    connections: [1]
  }
];
