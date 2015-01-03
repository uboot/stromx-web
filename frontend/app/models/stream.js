import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  file: DS.belongsTo('file', {async: true}),
  active: DS.attr('boolean'),
  paused: DS.attr('boolean'),
  operators: DS.hasMany('operator', {async: true}),
  connections: DS.hasMany('connection', {async: true}),
  views: DS.hasMany('view', {async: true}),
  threads: DS.hasMany('thread', {async: true}),
});
