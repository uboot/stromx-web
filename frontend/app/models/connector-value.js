import DS from "ember-data";

export default DS.Model.extend({
  variant: DS.attr(),
  value: DS.attr()
});
