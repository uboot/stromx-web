import DS from "ember-data";

export default DS.Model.extend({
  title: DS.attr('string'),
  variant: DS.attr(),
  behavior: DS.attr('string'),
  currentType: DS.attr('string')
});
