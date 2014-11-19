import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  observers: DS.hasMany('observer', {async: true,  polymorphic: true }),
  stream: DS.belongsTo('stream', {async: true})
});
