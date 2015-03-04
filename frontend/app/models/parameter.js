import DS from "ember-data";

export default DS.Model.extend({
  title: DS.attr('string'),
  variant: DS.attr(),
  value: DS.attr(),
  minimum: DS.attr('number'),
  maximum: DS.attr('number'),
  cols: DS.attr('number'),
  rows: DS.attr('number'),
  state: DS.attr('string'),
  access: DS.attr('string'),
  operator: DS.belongsTo('operator', {async: true}),
  descriptions: DS.hasMany('enum-description', {async: true}),
  observers: DS.hasMany('parameter-observer', {async: true})
});
