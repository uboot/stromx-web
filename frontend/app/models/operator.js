import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  status: DS.attr('string'),
  type: DS.attr('string'),
  package: DS.attr('string'),
  version: DS.attr('string'),
  parameters: DS.hasMany('parameter', {async: true}),
  position: DS.attr(),
  inputs: DS.hasMany('inputs', {async: true}),
  outputs: DS.hasMany('outputs', {async: true}),
  stream: DS.belongsTo('stream', {async: true})
});
