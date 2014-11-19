import DS from "ember-data";

export default DS.Model.extend({
  type: DS.attr('string'),
  package: DS.attr('string'),
  version: DS.attr('string')
});
