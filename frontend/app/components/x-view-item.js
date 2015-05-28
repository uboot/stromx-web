import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['active'],
  attributeBindings: ['role'],
  role: 'presentation',
  active: function() {
    return this.get('stream.view') === this.get('model.id');
  }.property('stream.view'),
  actions: {
    show: function() {
      this.get('stream').set('view', this.get('model.id'));
    }
  }
});
