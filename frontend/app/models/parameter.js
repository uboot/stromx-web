import DS from "ember-data";

export default DS.Model.extend({
  title: DS.attr('string'),
  variant: DS.attr('string'),
  value: DS.attr(),
  minimum: DS.attr('number'),
  maximum: DS.attr('number'),
  state: DS.attr('string'),
  writable: DS.attr('boolean'),
  operator: DS.belongsTo('operator', {async: true}),
  descriptions: DS.hasMany('enum-description', {async: true})
});
