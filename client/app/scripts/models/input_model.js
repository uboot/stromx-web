/* global App */

App.Input = DS.Model.extend({
  title: DS.attr('string'),
  thread: DS.hasMany('thread', {async: true})
});

App.Input.FIXTURES = [
  {
    id: 1,
    title: 'Input image',
    thread: []
  },
  {
    id: 2,
    title: 'Number',
    thread: [1]
  },
  {
    id: 3,
    title: 'Destination image',
    thread: []
  }
];