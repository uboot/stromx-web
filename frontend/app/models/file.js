import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  content: DS.attr('string'),
  opened: DS.attr('boolean'),
  stream: DS.belongsTo('stream', {async: true})
});
