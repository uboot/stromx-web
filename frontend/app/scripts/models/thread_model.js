/* global App */

App.Thread = DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('string')
});

App.Thread.FIXTURES = [
  {
    id: 1,
    name: 'Thread',
    color: '#ff0000'
  }
];