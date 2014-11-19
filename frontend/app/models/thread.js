import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('string'),
  stream: DS.belongsTo('stream', {async: true}),
  connections: DS.hasMany('connection', {async: true})
});

