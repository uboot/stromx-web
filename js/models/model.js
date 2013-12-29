App.File = DS.Model.extend({
  name: DS.attr('string'),
  content: DS.attr('string'),
  loaded: DS.attr('boolean'),
  stream: DS.hasMany('stream')
});

App.Stream = DS.Model.extend({
  name: DS.attr('string')
});

App.File.FIXTURES = [
  {
    id: 1,
    name: 'test.stromx',
    content: '',
    loaded: true,
    stream: [1]
  },
  {
    id: 2,
    name: 'hough.stromx',
    content: '',
    loaded: false,
    stream: []
  }
];

App.Stream.FIXTURES = [
  {
    id: 1,
    name: 'Stream one'
  }
];