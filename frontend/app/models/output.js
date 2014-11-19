import DS from "ember-data";

export default DS.Model.extend({
  title: DS.attr('string'),
  operator: DS.belongsTo('operator', {async: true}),
  connections: DS.hasMany('connection', {async: true})
});
