/* global App */

App.Thread = DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('string'),
  inputs: DS.hasMany('input', {async: true})
});

App.Thread.FIXTURES = [
  {
    id: 1,
    name: 'Thread',
    color: '#ff0000',
    inputs: [2]
  }
];