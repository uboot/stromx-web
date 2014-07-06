/* global App */

App.ObserverView = DS.Model.extend({
  name: DS.attr('string'),
  observers: DS.hasMany('observers', {async: true})
});

App.ObserverView.FIXTURES = [
  {
    id: 1,
    name: 'Observer',
    observers: [0]
  }
];
