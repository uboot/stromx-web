import DS from "ember-data";

var Connection = DS.Model.extend({
  output: DS.belongsTo('output', {async: true}),
  input: DS.belongsTo('input', {async: true}),
  thread: DS.belongsTo('thread', {async: true}),
  stream: DS.belongsTo('stream', {async: true})
});

Connection.reopenClass({
  FIXTURES: [
    {
      id: 1,
      output: 5,
      input: 2,
      thread: 1,
      stream: 2
    },
    {
      id: 2,
      output: 5,
      input: 3,
      thread: null,
      stream: 2
    }
  ]
});

export default Connection;
