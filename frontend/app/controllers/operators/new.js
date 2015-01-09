import Ember from "ember";

export default Ember.Controller.extend({
  operator: null,
  operators: function() {
    return this.store.find('operatorTemplate');
  }.property(),
  saveIsDisabled: Ember.computed.equal('operator', null),
  name: '',
  actions: {
    save: function () {
      var stream = this.get('model');
      var op = this.store.createRecord('operator', {
        name: this.get('name'),
        package: this.get('operator.package'),
        type: this.get('operator.type'),
        stream: stream,
        status: 'none',
        position: {
          x: 0,
          y: 0
        }
      });
      op.save();

      this.transitionToRoute('stream');
    }
  }
});
