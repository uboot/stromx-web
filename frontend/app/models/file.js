import DS from "ember-data";

var File = DS.Model.extend({
  name: DS.attr('string'),
  content: DS.attr('string'),
  opened: DS.attr('boolean'),
  stream: DS.belongsTo('stream', {async: true})
});

File.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: 'test.stromx',
      content: '',
      opened: true,
      stream: 2
    },
    {
      id: 2,
      name: 'hough.stromx',
      content: '',
      opened: false,
      stream: 3
    }
  ]
});

export default File;