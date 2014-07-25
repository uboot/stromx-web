/* global App */

App.Observer = DS.Model.extend({
  zvalue: DS.attr('number'),
  visualization: DS.attr('string'),
  color: DS.attr('string'),
  view: DS.belongsTo('view', {async: true}),
  title: ''
});
