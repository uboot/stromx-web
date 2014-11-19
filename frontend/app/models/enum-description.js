import DS from "ember-data";

export default DS.Model.extend({
  value: DS.attr('number'),
  title: DS.attr('string')
});
