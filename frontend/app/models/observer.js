import DS from "ember-data";

export default DS.Model.extend({
  zvalue: DS.attr('number'),
  visualization: DS.attr('string'),
  visualizations: DS.attr(),
  properties: DS.attr(),
  active: DS.attr('boolean'),
  view: DS.belongsTo('view', {async: true}),

  title: function() {
    return '';
  }.property()
});
