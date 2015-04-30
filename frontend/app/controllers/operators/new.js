import Ember from "ember";

export default Ember.Controller.extend({
  selectedOperator: null,
  selectedPackage: null,
  name: '',
  packages: function(key, value) {
    if (value !== undefined) {
      return value;
    }

    var _this = this;
    this.store.find('operatorTemplate').then(function(templates) {
      var packageNames = new Set(templates.mapBy('package'));
      var packages = [];
      for (var p of packageNames.values()){
        var operators = templates.filterBy('package', p);
        packages.push({
          name: p,
          operators: operators.sortBy('type')
        });
      }
      packages = packages.sortBy('name');
      _this.set('packages', packages);
    });

    return [];
  }.property(),
  saveIsDisabled: Ember.computed.equal('selectedOperator', null),
  updateName: function() {
    var op = this.get('selectedOperator');
    if (op === null) {
      return; 
    }
    
    if (this.get('name') !== '') {
      return; 
    }
      
    this.set('name', op.get('type'));
  }.observes('selectedOperator'),
  actions: {
    cancel: function() {
      this.set('name', '');
      this.transitionToRoute('stream.index', this.get('model'));
    },
    save: function () {
      var stream = this.get('model');
      var op = this.store.createRecord('operator', {
        name: this.get('name'),
        package: this.get('selectedOperator.package'),
        type: this.get('selectedOperator.type'),
        stream: stream,
        status: 'none',
        position: {
          x: 100,
          y: 100
        }
      });

      this.set('name', '');
      var _this = this;
      op.save().then(function(op) {
        _this.transitionToRoute('operator', op);
      });
    }
  }
});
