import DS from "ember-data";

export default DS.Model.extend({
  time: DS.attr('date'),
  description: DS.attr('string')
});
