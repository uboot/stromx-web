/* global App */

App.Input = DS.Model.extend({
  title: DS.attr('string'),
  output: DS.hasMany('output', {async: true})
});

App.Input.FIXTURES = [
  {
    id: 1,
    title: 'Input image',
    output: []
  },
  {
    id: 2,
    title: 'Number',
    output: [2]
  },
  {
    id: 3,
    title: 'Destination image',
    output: []
  }
]