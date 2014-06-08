/* global App */

App.Output = DS.Model.extend({
  title: DS.attr('string'),
  inputs: DS.hasMany('input', {async: true})
});

App.Output.FIXTURES = [
  {
    id: 1,
    title: 'Output image',
    inputs: []
  },
  {
    id: 2,
    title: 'Generated number',
    inputs: [2]
  },
  {
    id: 3,
    title: 'Received image',
    inputs: []
  }
];