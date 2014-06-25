/* global App */

App.Output = DS.Model.extend({
  title: DS.attr('string')
});

App.Output.FIXTURES = [
  {
    id: 1,
    title: 'Output image'
  },
  {
    id: 2,
    title: 'Generated number'
  },
  {
    id: 3,
    title: 'Received image'
  }
];