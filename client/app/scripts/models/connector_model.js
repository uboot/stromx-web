/* global App */

App.Connector = DS.Model.extend({
  title: DS.attr('string')
});

App.Connector.FIXTURES = [
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
  },
  {
    id: 4,
    title: 'Output image'
  },
  {
    id: 5,
    title: 'Generated number'
  },
  {
    id: 6,
    title: 'Received image'
  }
];