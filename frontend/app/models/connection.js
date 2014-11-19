import DS from "ember-data";

export default DS.Model.extend({
  output: DS.belongsTo('output', {async: true}),
  input: DS.belongsTo('input', {async: true}),
  thread: DS.belongsTo('thread', {async: true}),
  stream: DS.belongsTo('stream', {async: true})
});
