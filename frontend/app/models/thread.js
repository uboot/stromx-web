import DS from "ember-data";

var Thread = DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('string'),
  stream: DS.belongsTo('stream', {async: true}),
  connections: DS.hasMany('connection', {async: true})
});

Thread.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: 'Thread',
      color: '#be202e',
      stream: 2,
      connections: [1]
    }
  ]
});

export default Thread;
