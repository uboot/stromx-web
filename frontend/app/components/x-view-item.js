import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['active'],
  attributeBindings: ['role'],
  role: 'presentation',
  active: function() {
    return this.get('viewId') === this.get('model.id');
  }.property('viewId', 'model.id'),
  actions: {
    show: function() {
      this.sendAction('show', this.get('model.id'));
    }
  }
});
