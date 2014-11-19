import DS from "ember-data";

export default DS.Model.extend({
  variant: DS.attr('string'),
  value: DS.attr()
});
