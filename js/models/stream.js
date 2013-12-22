App.Stream = DS.Model.extend({
  name: DS.attr('string')
});

App.Stream.FIXTURES = [
  {
    id: 1,
    name: 'Stream one'
  },
  {
    id: 2,
    name: 'Stream two'
  }
];