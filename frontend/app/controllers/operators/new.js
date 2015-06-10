import Ember from "ember";

export default Ember.Controller.extend({
  selectedOperator: Ember.computed('operatorValue', function() {
    var operatorValue = this.get('operatorValue');
    if (operatorValue === null) {
      return null;
    }
    
    var op = this.get('selectedPackage.operators').findBy('value', operatorValue);
    return op === undefined ? null : op;
  }),
  selectedPackage: Ember.computed('packageValue', function() {
    var packageValue = this.get('packageValue');
    if (packageValue === null) {
      return null;
    }
    
    var p = this.get('packages').findBy('value', packageValue);
    return p === undefined ? null : p;
  }),
  packageValue: null,
  operatorValue: null,
  name: '',
  packages: Ember.computed({
    set: function(key, value) {
      return value;
    },
    get: function() {
      var _this = this;
      this.store.find('operatorTemplate').then(function(templates) {
        var packageNames = new Set(templates.mapBy('package'));
        var packages = [];
        var i = 0;
        for (var p of packageNames.values()){
          var operators = templates.filterBy('package', p);
          packages.push({
            value: i,
            name: p,
            operators: operators.sortBy('type').map(function(op, index) {
              return {
                value: index,
                type: op.get('type'),
                package: op.get('package')
              };
            })
          });
          i++;
        }
        packages = packages.sortBy('name');
        _this.set('packages', packages);
      });

      return [];
    }
  }),
  saveIsDisabled: Ember.computed.equal('selectedOperator', null),
  updateName: function() {
    var op = this.get('selectedOperator');
    if (op === null) {
      return; 
    }
    
    if (this.get('name') !== '') {
      return; 
    }
      
    this.set('name', op.type);
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
