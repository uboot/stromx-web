App.File = DS.Model.extend({
  name: DS.attr('string'),
  content: DS.attr('string'),
  opened: DS.attr('boolean'),
  stream: DS.hasMany('stream', {async: true})
});

App.Stream = DS.Model.extend({
  name: DS.attr('string')
});

App.File.FIXTURES = [
  {
    id: 1,
    name: 'test.stromx',
    content: '',
    opened: true,
    stream: [1]
  },
  {
    id: 2,
    name: 'hough.stromx',
    content: '',
    opened: false,
    stream: []
  }
];

App.Stream.FIXTURES = [
  {
    id: 1,
    name: 'Stream one'
  }
];