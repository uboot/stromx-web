/* global App */

App.Thread = DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('string'),
  stream: DS.belongsTo('stream', {async: true})
});

App.Thread.FIXTURES = [
  {
    id: 1,
    name: 'Thread',
    color: '#ff0000',
    stream: 2
  }
];
