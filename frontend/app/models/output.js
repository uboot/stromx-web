import DS from "ember-data";

export default DS.Model.extend({
  title: DS.attr('string'),
  variant: DS.attr(),
  operator: DS.belongsTo('operator', {async: true}),
  connections: DS.hasMany('connection', {async: true}),
  observers: DS.hasMany('output-observer', {async: true})
});
