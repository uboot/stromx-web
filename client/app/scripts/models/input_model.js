/* global App */

App.Input = DS.Model.extend({
  title: DS.attr('string')
});

App.Input.FIXTURES = [
  {
    id: 1,
    title: 'Input image'
  },
  {
    id: 2,
    title: 'Number'
  },
  {
    id: 3,
    title: 'Destination image'
  }
];